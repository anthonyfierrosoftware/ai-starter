# Generated by Django 5.0.3 on 2024-04-24 01:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("aiModule", "0017_message_functiondata_message_functiontype_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="message",
            name="functionData",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="message",
            name="functionType",
            field=models.CharField(blank=True, max_length=64, null=True),
        ),
    ]
