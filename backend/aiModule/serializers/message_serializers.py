from rest_framework import serializers
from django.apps import apps
from aiModule.models.Message import Message
from .conversation_serializers import ConversationSerializer


import re
import json

class MessageSerializer(serializers.ModelSerializer):
    '''
    Used to prep and send data to front
    
    '''
    
    # read only is set to true profiles should not be swapped between users
    owner = serializers.PrimaryKeyRelatedField( many=False, required=False, allow_null=True, default=None, read_only=True)
    conversation = ConversationSerializer(many=False, read_only=True)
    
    class Meta:
        model = Message
        fields = ["prompt","generatedReply", "response", "dateCreated", "owner", "totalTokens","pk", "llm", "chat_model","conversation"] 
        
    
class MessageWithoutConversationSerializer(serializers.ModelSerializer):
    '''
    Used to prep and send data to front
    
    '''
    
    # read only is set to true profiles should not be swapped between users
    owner = serializers.PrimaryKeyRelatedField( many=False, required=False, allow_null=True, default=None, read_only=True)
    
    class Meta:
        model = Message
        fields = ["prompt","generatedReply", "response", "dateCreated", "owner", "totalTokens","pk", "llm", "chat_model"] 
        
        
        

