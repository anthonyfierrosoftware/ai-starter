# Generated by Django 5.0.3 on 2024-05-01 02:30

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aiModule', '0020_remove_course_categoryid_remove_course_datecreated_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='dateCreated',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]