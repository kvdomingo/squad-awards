from django.contrib import admin

from .models import Answer, AwardChoice, DiscordUser

admin.site.register(Answer)
admin.site.register(AwardChoice)
admin.site.register(DiscordUser)
