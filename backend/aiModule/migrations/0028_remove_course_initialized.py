# Generated by Django 5.0.3 on 2024-05-06 22:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('aiModule', '0027_remove_lesson_minutecount_remove_lesson_quizcount'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='course',
            name='initialized',
        ),
    ]
