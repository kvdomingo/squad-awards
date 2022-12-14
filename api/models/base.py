from uuid import uuid4

from django.db import models


class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, unique=True, db_index=True, default=uuid4)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True
