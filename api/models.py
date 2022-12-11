from uuid import uuid4

from django.db import models


class DiscordUser(models.Model):
    id = models.UUIDField(primary_key=True, unique=True, db_index=True, default=uuid4)
    created = models.DateTimeField(auto_now_add=True)
    discord_id = models.CharField(max_length=32, unique=True, db_index=True)
    avatar = models.CharField(max_length=64)
    username = models.CharField(max_length=32)
    discriminator = models.CharField(max_length=4)

    def __str__(self):
        return f"{self.username}#{self.discriminator}"

    class Meta:
        ordering = ["username"]
        unique_together = ["username", "discriminator"]
