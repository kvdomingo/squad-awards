from django.db import models

from .base import BaseModel


class DiscordUser(BaseModel):
    discord_id = models.CharField(max_length=32, unique=True, db_index=True)
    avatar = models.CharField(max_length=64)
    username = models.CharField(max_length=32)
    discriminator = models.CharField(max_length=4)

    def __str__(self):
        return f"{self.username}#{self.discriminator}"

    class Meta:
        ordering = ["username"]
        unique_together = ["username", "discriminator"]
