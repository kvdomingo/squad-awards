from loguru import logger
from rest_framework import status
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from ..models import Answer
from ..serializers import AnswerSerializer
from ..types import RESTRequest


class AnswerView(RetrieveModelMixin, CreateModelMixin, GenericViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [AllowAny]

    def retrieve(self, request: RESTRequest, *args, **kwargs):
        user = request.session.get("user")
        pk = kwargs.get("pk")
        if user["id"] != pk:
            return Response(status=status.HTTP_403_FORBIDDEN)
        obj = self.queryset.select_related("user").get(user__discord_id=user["discord_id"])
        serializer = self.serializer_class(obj)
        data = serializer.data
        return Response(data["answers"])

    def create(self, request: RESTRequest, *args, **kwargs):
        user = request.session.get("user")
        if not request.COOKIES.get("access") and not user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        if Answer.objects.select_related("user").filter(user__discord_id=user["discord_id"]).exists():
            return Response({"error": "You have already answered."}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.serializer_class(
            data={
                "user": request.session.get("user")["id"],
                "answers": request.data,
            }
        )
        if not serializer.is_valid():
            logger.error(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=self.get_success_headers(serializer.data)
        )
