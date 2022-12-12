from uuid import uuid4

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _


class AwardCategory(models.TextChoices):
    BEST_FEMALE_SOLO_ARTIST = "BFSA", _("Best Female Solo Artist")
    BEST_MALE_SOLO_ARTIST = "BMSA", _("Best Male Solo Artist")
    BEST_FEMALE_GROUP = "BFG", _("Best Female Group")
    BEST_MALE_GROUP = "BMG", _("Best Male Group")
    MUSIC_VIDEO_OF_THE_YEAR = "MVOTY", _("Music Video of the Year")
    ROOKIE_OF_THE_YEAR = "ROTY", _("Rookie of the Year")
    ALBUM_OF_THE_YEAR = "AOTY", _("Album of the Year")
    SONG_OF_THE_YEAR = "SOTY", _("Song of the Year")
    BSIDE_OF_THE_YEAR = "BOTY", _("B-Side of the Year")
    SADGE_OF_THE_YEAR = "SADGE", _("Sadge of the Year")


class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, unique=True, db_index=True, default=uuid4)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True


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


class AwardChoice(BaseModel):
    category = models.CharField(max_length=8, choices=AwardCategory.choices)
    name = models.CharField(max_length=256)
    image = models.CharField(max_length=4096, null=True)

    def __str__(self):
        return f"[{self.category}] {self.name}"

    class Meta:
        ordering = ["category", "name"]


class Answer(BaseModel):
    user = models.OneToOneField("DiscordUser", on_delete=models.CASCADE)
    answer = models.ForeignKey("AwardChoice", on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return str(self.id)

    def validate_unique(self, exclude=None):
        super().validate_unique(exclude=exclude)
        if (
            self.__class__.objects.select_related("answer")
            .filter(answer__category=self.answer.category)
            .exclude(id=self.id)
            .exists()
        ):
            raise ValidationError(
                message="Answer with this (user, answer__category) already exists.", code="unique_together"
            )

    class Meta:
        ordering = ["user", "answer__category"]
