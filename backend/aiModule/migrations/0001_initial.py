# Generated by Django 5.0.3 on 2024-06-11 22:52

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='LLMConfiguration',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('api_key', models.TextField(blank=True, null=True)),
                ('llm', models.CharField(blank=True, max_length=24, null=True)),
                ('chat_model', models.TextField(blank=True, null=True)),
                ('date_created', models.DateTimeField(default=django.utils.timezone.now)),
                ('last_updated', models.DateTimeField(default=django.utils.timezone.now)),
                ('system_instructions', models.TextField(blank=True, null=True)),
                ('polymorphic_ctype', models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='polymorphic_%(app_label)s.%(class)s_set+', to='contenttypes.contenttype')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
        ),
        migrations.CreateModel(
            name='Conversation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=256, null=True)),
                ('date_created', models.DateTimeField(default=django.utils.timezone.now)),
                ('last_updated', models.DateTimeField(default=django.utils.timezone.now)),
                ('chat_history', models.TextField(blank=True, null=True)),
                ('total_tokens', models.IntegerField(blank=True, default=0, null=True)),
                ('gpt3_tokens', models.IntegerField(blank=True, default=0, null=True)),
                ('gpt4_tokens', models.IntegerField(blank=True, default=0, null=True)),
                ('claude_tokens', models.IntegerField(blank=True, default=0, null=True)),
                ('mistral_tokens', models.IntegerField(blank=True, default=0, null=True)),
                ('llama2_tokens', models.IntegerField(blank=True, default=0, null=True)),
                ('hugging_other_tokens', models.IntegerField(blank=True, default=0, null=True)),
                ('owner', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='conversations', to='users.profile')),
                ('polymorphic_ctype', models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='polymorphic_%(app_label)s.%(class)s_set+', to='contenttypes.contenttype')),
                ('llm_config', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='conversation', to='aiModule.llmConfiguration')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('prompt', models.TextField(blank=True, null=True)),
                ('generated_reply', models.TextField(blank=True, null=True)),
                ('response', models.TextField(blank=True, null=True)),
                ('date_created', models.DateTimeField(default=django.utils.timezone.now)),
                ('total_tokens', models.IntegerField(blank=True, default=0, null=True)),
                ('llm', models.CharField(blank=True, max_length=24, null=True)),
                ('chat_model', models.TextField(blank=True, null=True)),
                ('conversation', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='aiModule.conversation')),
                ('owner', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='users.profile')),
                ('polymorphic_ctype', models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='polymorphic_%(app_label)s.%(class)s_set+', to='contenttypes.contenttype')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
        ),
    ]
