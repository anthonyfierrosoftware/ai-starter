# Generated by Django 5.0.3 on 2024-04-10 17:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aiModule', '0003_rename_rawtext_message_prompt'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='generatedReply',
            field=models.TextField(blank=True, null=True),
        ),
    ]
