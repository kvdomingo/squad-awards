from django.db import models

from .base import BaseModel


class Answer(BaseModel):
    user = models.OneToOneField("DiscordUser", on_delete=models.CASCADE)
    answers = models.JSONField()

    def __str__(self):
        return str(self.id)

    class Meta:
        ordering = ["-created"]
