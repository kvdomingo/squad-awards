from dotenv import load_dotenv

load_dotenv()

import django

django.setup()

import json

from django.conf import settings

from ..models import AwardChoice


def main():
    with open(settings.BASE_DIR / "api" / "data" / "options.json", "r") as f:
        options = json.load(f)
    choices = []
    for key, values in options.items():
        for value in values:
            value.pop("key")
            value["category"] = key
            value["name"] = value.pop("label")
            obj = AwardChoice(**value)
            choices.append(obj)
    AwardChoice.objects.bulk_create(choices)


if __name__ == "__main__":
    main()
