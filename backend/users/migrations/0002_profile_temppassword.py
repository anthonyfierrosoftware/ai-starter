# Generated by Django 5.0.3 on 2024-03-28 23:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='tempPassword',
            field=models.CharField(blank=True, max_length=128, null=True),
        ),
    ]
