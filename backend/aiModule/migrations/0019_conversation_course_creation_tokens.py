# Generated by Django 5.0.3 on 2024-04-26 21:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aiModule', '0018_alter_message_functiondata_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='conversation',
            name='course_creation_tokens',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]
