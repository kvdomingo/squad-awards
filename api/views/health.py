from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..types import RESTRequest


@api_view()
def health(_: RESTRequest):
    return Response("ok", content_type="text/plain")
