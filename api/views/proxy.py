import requests
from django.conf import settings
from loguru import logger
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..spotify import get_access_token
from ..types import RESTRequest


@api_view()
def spotify_proxy(request: RESTRequest, path: str):
    api_url = settings.SPOTIFY_API_URL
    api_url = api_url._replace(path=f"{api_url.path}/{path}")
    access = get_access_token()
    if access is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    r = requests.get(
        api_url.geturl(),
        params={**request.GET},
        headers={"Authorization": f"Bearer {access}"},
    )
    logger.debug(f"GET {r.url} {r.status_code} {r.elapsed.microseconds / 1e6:.2f}ms")
    return Response(r.json(), status=r.status_code)
