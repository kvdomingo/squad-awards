"""
Django settings for squad_awards project.

Generated by 'django-admin startproject' using Django 4.1.4.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""
import os
import urllib.parse
from pathlib import Path

import dj_database_url
from django.core.management.utils import get_random_secret_key
from dotenv import load_dotenv

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/
PYTHON_ENV = os.environ.get("PYTHON_ENV", "production")

PRODUCTION = PYTHON_ENV == "production"

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("SECRET_KEY", default=get_random_secret_key())

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = not PRODUCTION

DEBUG_PROPAGATE_EXCEPTIONS = True

if PRODUCTION:
    ALLOWED_HOSTS = [
        ".kvdstudio.app",
    ]
else:
    ALLOWED_HOSTS = ["*"]


# Application definition

INSTALLED_APPS = [
    "api.apps.ApiConfig",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "squad_awards.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "web" / "app"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "squad_awards.wsgi.application"

CORS_ORIGIN_ALLOW_ALL = not PRODUCTION

CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://(.+)\.kvdstudio\.app$",
]


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

if PRODUCTION:
    DATABASE_URL = os.environ.get("DATABASE_URL")
    DATABASE_CONFIG = dj_database_url.parse(DATABASE_URL)
    DATABASE_CONFIG["HOST"] = urllib.parse.unquote(DATABASE_CONFIG["HOST"])
else:
    DATABASE_CONFIG = dj_database_url.config()


DATABASES = {"default": DATABASE_CONFIG}

if PRODUCTION:
    REST_FRAMEWORK = {
        "DEFAULT_RENDERER_CLASSES": [
            "rest_framework.renderers.JSONRenderer",
        ]
    }


# Cache

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "TIMEOUT": None,
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Asia/Seoul"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = "/static/"

STATIC_ROOT = BASE_DIR / "static"

STATICFILES_DIRS = [
    BASE_DIR / "web" / "app",
    BASE_DIR / "web" / "app" / "assets",
]

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Discord config

DISCORD_CLIENT_ID = os.environ.get("DISCORD_CLIENT_ID")

DISCORD_CLIENT_SECRET = os.environ.get("DISCORD_CLIENT_SECRET")

DISCORD_CALLBACK_URL = (
    "http://squad-awards.localhost/api/callback" if PRODUCTION else "http://dev.squad-awards.localhost/api/callback"
)

DISCORD_API_URL = urllib.parse.urlparse("https://discord.com/api/v10")

DISCORD_AUTH_URL = urllib.parse.urlparse("https://discord.com/oauth2")

# Spotify config

SPOTIFY_CLIENT_ID = os.environ.get("SPOTIFY_CLIENT_ID")

SPOTIFY_CLIENT_SECRET = os.environ.get("SPOTIFY_CLIENT_SECRET")

SPOTIFY_API_URL = urllib.parse.urlparse("https://api.spotify.com/v1")

SPOTIFTY_AUTH_URL = urllib.parse.urlparse("https://accounts.spotify.com")

# YouTube config

YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY")

YOUTUBE_API_URL = urllib.parse.urlparse("https://youtube.googleapis.com/youtube/v3")
