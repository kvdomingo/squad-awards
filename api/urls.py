from django.urls import path

from .views import (
    auth_callback,
    get_current_user,
    health,
    list_award_categories,
    list_award_choices,
    login,
    logout,
    refresh,
)

urlpatterns = [
    path("", health),
    path("auth/token", login),
    path("callback", auth_callback),
    path("auth/user", get_current_user),
    path("auth/refresh", refresh),
    path("auth/logout", logout),
    path("categories", list_award_categories),
    path("choices", list_award_choices),
]
