from django.db import models
from polymorphic.models import PolymorphicModel
from django.utils import timezone


class Conversation(PolymorphicModel):
    """
    This is a data structure used to hold messages generated for a conversation
    This will disucssions between the user and the system
    """

    name = models.CharField(max_length=256, null=True, blank=True)
    date_created = models.DateTimeField(default=timezone.now)

    # updated in signals.py using receiver
    last_updated = models.DateTimeField(default=timezone.now)

    # the chat history for the conversation
    chat_history = models.TextField(blank=True, null=True)

    owner = models.ForeignKey(
        "users.Profile",
        default=None,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        related_name="conversations",
    )

    total_tokens = models.IntegerField(null=True, blank=True, default=0)

    gpt3_tokens = models.IntegerField(null=True, blank=True, default=0)

    gpt4_tokens = models.IntegerField(null=True, blank=True, default=0)

    claude_tokens = models.IntegerField(null=True, blank=True, default=0)

    mistral_tokens = models.IntegerField(null=True, blank=True, default=0)

    llama2_tokens = models.IntegerField(null=True, blank=True, default=0)

    hugging_other_tokens = models.IntegerField(null=True, blank=True, default=0)

    llm_config = models.ForeignKey(
        "aiModule.LLMConfiguration",
        default=None,
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
        related_name="conversation",
    )
