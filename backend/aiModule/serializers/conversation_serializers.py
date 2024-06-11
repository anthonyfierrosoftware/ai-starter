from django.contrib.auth.models import User
from rest_framework import serializers
from django.apps import apps
from aiModule.models import Conversation, Message

from aiModule.serializers.config_serializers import ConfigSerializer

# from rest_framework.authtoken.models import Token

import json


class ConversationSerializer(serializers.ModelSerializer):
    """
    Used to prep and send data to front

    """

    # read only is set to true profiles should not be swapped between users
    llmConfig = ConfigSerializer(many=False, read_only=True)
    owner = serializers.PrimaryKeyRelatedField(
        many=False, required=False, allow_null=True, default=None, read_only=True
    )

    class Meta:
        model = Conversation
        fields = [
            "pk",
            "name",
            "dateCreated",
            "lastUpdated",
            "llmConfig",
            "owner",
            "total_tokens",
            "gpt3_tokens",
            "gpt4_tokens",
            "claude_tokens",
            "mistral_tokens",
            "llama2_tokens",
            "hugging_other_tokens",
            "chatHistory",
        ]

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        try:
            if "chatHistory" in ret and ret["chatHistory"]:
                ret["chatHistory"] = json.loads(ret["chatHistory"])
            else:
                ret["chatHistory"] = []

        except Exception as e:
            print(f"Error in to_rep in ConversationSerializer: {e}")

        return ret


class UserDataConversationSerializer(serializers.ModelSerializer):
    """
    Used to prep and send data to the userdata route

    """

    # read only is set to true profiles should not be swapped between users

    owner = serializers.PrimaryKeyRelatedField(
        many=False, required=False, allow_null=True, default=None, read_only=True
    )

    class Meta:
        model = Conversation
        fields = [
            "pk",
            "name",
            "dateCreated",
            "lastUpdated",
            "owner",
            "total_tokens",
            "chatHistory",
        ]

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        try:
            if "chatHistory" in ret and ret["chatHistory"]:
                ret["chatHistory"] = json.loads(ret["chatHistory"])
            else:
                ret["chatHistory"] = []

        except Exception as e:
            print(f"Error in to_rep in ConversationSerializer: {e}")

        return ret


class ConversationWithMessagesSerializer(serializers.ModelSerializer):
    """
    Used to prep and send data to front

    """

    # read only is set to true profiles should not be swapped between users
    owner = serializers.PrimaryKeyRelatedField(
        many=False, required=False, allow_null=True, default=None, read_only=True
    )

    class Meta:
        model = Conversation
        fields = [
            "pk",
            "name",
            "dateCreated",
            "lastUpdated",
            "llmConfig",
            "owner",
            "total_tokens",
            "gpt3_tokens",
            "gpt4_tokens",
            "claude_tokens",
            "mistral_tokens",
            "llama2_tokens",
            "hugging_other_tokens",
            "chatHistory",
        ]

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        try:
            ret["chatHistory"] = json.loads(ret["chatHistory"])
            temp = instance.messages.all()
            ret["messages"] = MessageWithoutConversationSerializer(temp, many=True).data

        except Exception as e:
            print(f"Error in to_rep in ConversationSerializer: {e}")

        return ret


class MessageWithoutConversationSerializer(serializers.ModelSerializer):
    """
    Used with ConversationWithMessagesSerializerto format messages

    """

    # read only is set to true profiles should not be swapped between users
    owner = serializers.PrimaryKeyRelatedField(
        many=False, required=False, allow_null=True, default=None, read_only=True
    )

    class Meta:
        model = Message
        fields = [
            "prompt",
            "generatedReply",
            "response",
            "dateCreated",
            "owner",
            "totalTokens",
            "pk",
            "llm",
            "chat_model",
        ]
