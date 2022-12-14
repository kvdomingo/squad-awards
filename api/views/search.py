import requests
from django.conf import settings
from loguru import logger
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..spotify import get_access_token
from ..types import RESTRequest


@api_view()
def spotify_search(request: RESTRequest):
    api_url = settings.SPOTIFY_API_URL
    api_url = api_url._replace(path=f"{api_url.path}/search")
    access = get_access_token()
    if access is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    r = requests.get(
        api_url.geturl(),
        params={**request.GET},
        headers={"Authorization": f"Bearer {access}"},
    )
    logger.debug(f"GET {r.url} {r.status_code} {r.elapsed.microseconds / 1e6:.2f}ms")
    if not r.ok:
        logger.error(r.text)
        return Response([], status=r.status_code)
    return Response(r.json())


@api_view()
def youtube_search(request: RESTRequest):
    api_url = settings.YOUTUBE_API_URL
    api_url = api_url._replace(path=f"{api_url.path}/search")
    r = requests.get(
        api_url.geturl(),
        params={
            "part": "snippet",
            "regionCode": "KR",
            "q": request.GET.get("q"),
            "type": "video",
            "key": settings.YOUTUBE_API_KEY,
            "publishedAfter": "2021-12-01T00:00:00Z",
            "publishedBefore": "2023-01-01T00:00:00Z",
            "maxResults": 20,
        },
    )
    logger.debug(f"GET {r.url} {r.status_code} {r.elapsed.microseconds / 1e6:.2f}ms")
    if not r.ok:
        logger.error(r.text)
        return Response([], status=r.status_code)
    return Response(r.json())
