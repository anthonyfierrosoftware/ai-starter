# Generated by Django 5.0.3 on 2024-04-12 19:51

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("aiModule", "0010_remove_llmconfiguration_owner"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="conversation",
            name="gptConfig",
        ),
        migrations.AlterField(
            model_name="conversation",
            name="llmConfig",
            field=models.ForeignKey(
                blank=True,
                default=None,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="conversation",
                to="aiModule.llmconfiguration",
            ),
        ),
    ]
