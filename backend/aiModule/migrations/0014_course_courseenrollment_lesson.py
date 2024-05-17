# Generated by Django 5.0.3 on 2024-04-22 17:08

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aiModule', '0013_conversation_hugging_other_tokens_and_more'),
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256, null=True)),
                ('categoryId', models.CharField(max_length=256)),
                ('description', models.TextField(blank=True, max_length=512, null=True)),
                ('createdBy', models.CharField(blank=True, max_length=8, null=True)),
                ('dateCreated', models.DateTimeField(default=django.utils.timezone.now)),
                ('lessonCount', models.IntegerField(blank=True, default=0, null=True)),
                ('minuteCount', models.IntegerField(blank=True, default=0, null=True)),
                ('quizCount', models.IntegerField(blank=True, default=0, null=True)),
                ('polymorphic_ctype', models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='polymorphic_%(app_label)s.%(class)s_set+', to='contenttypes.contenttype')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
        ),
        migrations.CreateModel(
            name='CourseEnrollment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dateEnrolled', models.DateTimeField(default=django.utils.timezone.now)),
                ('lessonsProgress', models.TextField(blank=True, max_length=2000, null=True)),
                ('course', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='enrollment', to='aiModule.course')),
                ('polymorphic_ctype', models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='polymorphic_%(app_label)s.%(class)s_set+', to='contenttypes.contenttype')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
        ),
        migrations.CreateModel(
            name='Lesson',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=256, null=True)),
                ('lessonCount', models.IntegerField(blank=True, default=0, null=True)),
                ('minuteCount', models.IntegerField(blank=True, default=0, null=True)),
                ('quizCount', models.IntegerField(blank=True, default=0, null=True)),
                ('slides', models.TextField(max_length=99999)),
                ('course', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='lessons', to='aiModule.course')),
                ('polymorphic_ctype', models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='polymorphic_%(app_label)s.%(class)s_set+', to='contenttypes.contenttype')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
        ),
    ]
