from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models import AwardCategory
from ..types import RESTRequest


@api_view()
def list_award_categories(_: RESTRequest):
    data = [{"key": cat[0], "label": cat[1]} for cat in AwardCategory.choices]
    return Response(data)
