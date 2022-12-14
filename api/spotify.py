from base64 import b64encode

import requests
from django.conf import settings
from django.core.cache import cache
from loguru import logger


def get_access_token():
    if (access := cache.get("spotify_access_token")) is not None:
        return access
    auth_url = settings.SPOTIFTY_AUTH_URL
    auth_url = auth_url._replace(path="/api/token")
    basic_auth = b64encode(f"{settings.SPOTIFY_CLIENT_ID}:{settings.SPOTIFY_CLIENT_SECRET}".encode()).decode()
    res = requests.post(
        auth_url.geturl(),
        data={"grant_type": "client_credentials"},
        headers={
            "Authorization": f"Basic {basic_auth}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    )
    logger.debug(f"POST {auth_url.geturl()} {res.status_code} {res.elapsed.microseconds / 1e3:.2f}ms")
    if not res.ok:
        logger.error(res.text)
        return None
    data = res.json()
    cache.set("spotify_access_token", data["access_token"], timeout=data["expires_in"])
    return data["access_token"]
