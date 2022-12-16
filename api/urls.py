from django.urls import path
from rest_framework.routers import SimpleRouter

from .views import (
    AnswerView,
    auth_callback,
    get_current_user,
    health,
    list_award_categories,
    list_award_choices,
    logout,
    spotify_proxy,
    spotify_search,
    youtube_search,
    youtube_thumbnail_proxy,
)

router = SimpleRouter(trailing_slash=False)
router.register("answer", AnswerView)

urlpatterns = [
    path("", health),
    path("callback", auth_callback),
    path("auth/user", get_current_user),
    path("auth/logout", logout),
    path("categories", list_award_categories),
    path("choices", list_award_choices),
    path("spotify/search", spotify_search),
    path("spotify/proxy/<path:path>", spotify_proxy),
    path("youtube/imgProxy", youtube_thumbnail_proxy),
    path("youtube/search", youtube_search),
    *router.urls,
]
