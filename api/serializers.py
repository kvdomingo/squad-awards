from rest_framework import serializers

from .models import Answer, AwardChoice, DiscordUser


class DiscordUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscordUser
        fields = "__all__"


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = "__all__"


class AwardChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AwardChoice
        fields = "__all__"
