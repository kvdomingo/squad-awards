# Generated by Django 4.1.4 on 2022-12-12 11:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0004_awardchoice_image"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="awardchoice",
            options={"ordering": ["category", "name"]},
        ),
    ]