from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models import AwardChoice
from ..serializers import AwardChoiceSerializer
from ..types import RESTRequest


@api_view()
def list_award_choices(_: RESTRequest):
    queryset = AwardChoice.objects.all()
    serializer = AwardChoiceSerializer(queryset, many=True)
    return Response(serializer.data)
