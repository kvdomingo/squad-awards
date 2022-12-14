from django.db import models
from django.utils.translation import gettext_lazy as _

from .base import BaseModel


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


class AwardChoice(BaseModel):
    category = models.CharField(max_length=8, choices=AwardCategory.choices)
    name = models.CharField(max_length=256)
    image = models.CharField(max_length=4096, null=True)

    def __str__(self):
        return f"[{self.category}] {self.name}"

    class Meta:
        ordering = ["category", "name"]
