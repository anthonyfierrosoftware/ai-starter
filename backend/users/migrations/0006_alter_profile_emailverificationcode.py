# Generated by Django 5.0.3 on 2024-04-19 16:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0005_profile_changetemppassword"),
    ]

    operations = [
        migrations.AlterField(
            model_name="profile",
            name="emailVerificationCode",
            field=models.CharField(blank=True, max_length=128, null=True),
        ),
    ]
