# Generated by Django 5.0.3 on 2024-05-06 18:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('aiModule', '0026_course_lesson_gen_tokens'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lesson',
            name='minuteCount',
        ),
        migrations.RemoveField(
            model_name='lesson',
            name='quizCount',
        ),
    ]
