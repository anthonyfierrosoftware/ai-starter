# Generated by Django 5.0.3 on 2024-04-11 22:07

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aiModule', '0007_llmconfiguration'),
    ]

    operations = [
        migrations.AddField(
            model_name='conversation',
            name='llmConfig',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='conversation', to='aiModule.llmconfiguration'),
        ),
    ]