from typing import TypeAlias

from django.http import HttpRequest
from rest_framework.request import Request

RESTRequest: TypeAlias = HttpRequest | Request
