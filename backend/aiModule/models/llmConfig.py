from django.db import models
from datetime import timezone
from polymorphic.models import PolymorphicModel
from django.utils import timezone


LLM = {
    "OPEN_AI": "OPEN_AI",
    "CLAUDE": "CLAUDE",
    "MISTRAL": "MISTRAL",
    "HUGGINGFACE": "HUGGINGFACE",
}

MODELS = {
    "gpt-3.5-turbo": "gpt-3.5-turbo",
    "gpt-4-turbo": "gpt-4-turbo",
    "gpt-4o":"gpt-4o",
    "gpt-4o-mini":"gpt-4o-mini",
    
    "claude-3-opus-20240229": "claude-3-opus-20240229",
    "claude-3-5-sonnet-20240620": "claude-3-5-sonnet-20240620",
    #last years model
    "claude-3-sonnet-20240229":"claude-3-sonnet-20240229",
    "claude-3-haiku-20240307":"claude-3-haiku-20240307",
    
    "mistral-large-latest": "mistral-large-latest",
    "open-mistral-nemo":"open-mistral-nemo",
    "meta-llama/Llama-2-70b-chat-hf": "meta-llama/Llama-2-70b-chat-hf",
}

LLM_MODEL = {
    "OPEN_AI": ["gpt-3.5-turbo", "gpt-4-turbo","gpt-4o","gpt-4o-mini"],
    "CLAUDE": ["claude-3-opus-20240229","claude-3-5-sonnet-20240620", "claude-3-sonnet-20240229","claude-3-haiku-20240307"],
    "MISTRAL": ["mistral-large-latest","open-mistral-nemo"],
    "HUGGINGFACE": ["meta-llama/Llama-2-70b-chat-hf"],
}


class LLMConfiguration(PolymorphicModel):
    """
    This is a general configuration class to be used with conversations
    this object is responsible for setting and saveing llm configurations
    """

    api_key = models.TextField(blank=True, null=True)

    llm = models.CharField(max_length=24, null=True, blank=True)

    chat_model = models.TextField(blank=True, null=True)

    date_created = models.DateTimeField(default=timezone.now)

    last_updated = models.DateTimeField(default=timezone.now)

    # a json field to store the messages
    system_instructions = models.TextField(blank=True, null=True)
