import urllib.parse
from datetime import timedelta
from hashlib import sha256

import requests
from django.conf import settings
from django.http import HttpResponseRedirect
from loguru import logger
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models import Answer, DiscordUser
from ..serializers import DiscordUserSerializer
from ..types import RESTRequest


@api_view()
def login(request: RESTRequest):
    if not request.session.session_key:
        request.session.create()
    params = {
        "response_type": "code",
        "client_id": settings.DISCORD_CLIENT_ID,
        "scope": "identify",
        "redirect_uri": urllib.parse.quote(settings.DISCORD_CALLBACK_URL, safe=""),
        "state": sha256(request.session.session_key.encode()).hexdigest(),
    }
    qs = "&".join([f"{k}={v}" for k, v in params.items()])
    auth_url = settings.DISCORD_AUTH_URL
    auth_url = auth_url._replace(path=f"{auth_url.path}/authorize")
    redirect_to = f"{auth_url.geturl()}?{qs}"
    return HttpResponseRedirect(redirect_to)


@api_view()
def auth_callback(request: RESTRequest):
    code = request.GET.get("code")
    state = request.GET.get("state")
    expected_state = sha256(request.session.session_key.encode()).hexdigest()
    if state is None or expected_state != state:
        logger.debug(f"Expected {expected_state}, got {state}")
        return HttpResponseRedirect("/", status=status.HTTP_401_UNAUTHORIZED)
    data = {
        "client_id": settings.DISCORD_CLIENT_ID,
        "client_secret": settings.DISCORD_CLIENT_SECRET,
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": settings.DISCORD_CALLBACK_URL,
    }
    api_url = settings.DISCORD_API_URL
    api_url = api_url._replace(path=f"{settings.DISCORD_API_URL.path}/oauth2/token")
    r = requests.post(
        api_url.geturl(),
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    logger.debug(f"{r.request.method} {r.url} {r.status_code} {r.elapsed.microseconds / 1e3:.2f}ms")
    if not r.ok:
        logger.error(r.text)
        return HttpResponseRedirect("/", status=r.status_code)
    auth_response = r.json()
    access = auth_response["access_token"]
    refresh = auth_response["refresh_token"]

    api_url = api_url._replace(path=f"{settings.DISCORD_API_URL.path}/users/@me")
    r = requests.get(api_url.geturl(), headers={"Authorization": f"Bearer {access}"})
    logger.debug(f"{r.request.method} {r.url} {r.status_code} {r.elapsed.microseconds / 1e3:.2f}ms")
    if not r.ok:
        logger.error(r.text)
        return HttpResponseRedirect("/", status=r.status_code)
    data: dict = r.json()
    d_id = data.pop("id")
    valid_fields = [field.name for field in DiscordUser._meta.get_fields()]
    user_response = {k: v for k, v in data.items() if k in valid_fields}
    obj, _ = DiscordUser.objects.update_or_create(discord_id=d_id, defaults=user_response)
    request.session.update({"user": DiscordUserSerializer(obj).data})

    res = HttpResponseRedirect("/")
    res.set_cookie(
        "access",
        access,
        httponly=True,
        secure=settings.PRODUCTION,
        path="/",
        samesite="Strict",
        max_age=auth_response["expires_in"],
    )
    res.set_cookie(
        "refresh",
        refresh,
        httponly=True,
        secure=settings.PRODUCTION,
        path="/api/auth",
        samesite="Strict",
        max_age=timedelta(days=14),
    )
    return res


@api_view()
def get_current_user(request: RESTRequest):
    access = request.COOKIES.get("access")
    if not access:
        return Response({"error": "Missing access token"}, status=status.HTTP_401_UNAUTHORIZED)
    api_url = settings.DISCORD_API_URL
    api_url = api_url._replace(path=f"{api_url.path}/users/@me")
    r = requests.get(api_url.geturl(), headers={"Authorization": f"Bearer {access}"})
    if not r.ok:
        logger.error(r.text)
        return HttpResponseRedirect("/", status=r.status_code)
    user_response: dict = r.json()
    valid_fields = DiscordUser._meta.get_fields()
    d_id = user_response.pop("id")
    user_response = {k: v for k, v in user_response.items() if k in valid_fields}
    obj, created = DiscordUser.objects.update_or_create(discord_id=d_id, defaults=user_response)
    if created:
        has_answered = False
    else:
        has_answered = Answer.objects.select_related("user").filter(user__discord_id=obj.discord_id).exists()
    user = {**DiscordUserSerializer(obj).data, "has_answered": has_answered}
    request.session.update({"user": user})
    return Response(user)


@api_view()
def refresh(request: RESTRequest):
    data = {
        "client_id": settings.DISCORD_CLIENT_ID,
        "client_secret": settings.DISCORD_CLIENT_SECRET,
        "grant_type": "refresh_token",
        "refresh_token": request.COOKIES.get("refresh"),
    }
    auth_url = settings.DISCORD_AUTH_URL
    auth_url = auth_url._replace(path=f"{auth_url.path}/token")
    r = requests.post(
        auth_url.geturl(),
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    if not r.ok:
        return Response({"error": r.text}, status=r.status_code)
    data = r.json()
    res = Response(status=status.HTTP_204_NO_CONTENT)
    res.set_cookie(
        "access",
        data["access_token"],
        httponly=True,
        secure=settings.PRODUCTION,
        path="/",
        samesite="Strict",
        max_age=data["expires_in"],
    )
    res.set_cookie(
        "refresh",
        data["refresh_token"],
        httponly=True,
        secure=settings.PRODUCTION,
        path="/api/auth",
        samesite="Strict",
        max_age=timedelta(days=14),
    )
    return res


@api_view()
def logout(request: RESTRequest):
    res = Response(status=status.HTTP_204_NO_CONTENT)
    res.delete_cookie("access", path="/", samesite="Strict")
    res.delete_cookie("refresh", path="/api/auth", samesite="Strict")
    request.session.flush()
    return res
