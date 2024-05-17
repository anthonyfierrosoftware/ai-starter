# Generated by Django 5.0.3 on 2024-04-24 01:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aiModule', '0016_alter_lesson_slides'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='functionData',
            field=models.CharField(blank=True, max_length=64, null=True),
        ),
        migrations.AddField(
            model_name='message',
            name='functionType',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='slides',
            field=models.TextField(blank=True, max_length=99999, null=True),
        ),
    ]
