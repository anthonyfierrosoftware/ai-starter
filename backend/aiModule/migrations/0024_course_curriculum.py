# Generated by Django 5.0.3 on 2024-05-03 20:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aiModule', '0023_courseenrollment_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='curriculum',
            field=models.TextField(blank=True, null=True),
        ),
    ]