from rest_framework import serializers

from ..models import AwardChoice


class AwardChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AwardChoice
        fields = "__all__"
