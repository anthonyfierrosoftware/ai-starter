from django.db import models
from datetime import datetime, timezone, timedelta
from polymorphic.models import PolymorphicModel
from django.apps import apps
from django.utils import timezone
from django.contrib.auth.models import User



class Message(PolymorphicModel):
    '''
    This is the parent class for text based objects generated with ai
    '''
    prompt=models.TextField(blank=True, null=True)
    
    generatedReply = models.TextField(blank=True, null=True)
    
    response= models.TextField(blank=True, null=True)

    dateCreated=models.DateTimeField(default=timezone.now)
    
    # a json field to store the messages ** remove only add to conversation
    totalTokens= models.IntegerField(null= True, blank = True, default = 0)
    
    #the container for the conversation
    conversation = models.ForeignKey("aiModule.Conversation", default=None, blank=True, null=True, on_delete=models.CASCADE, related_name="messages")

    #USER
    owner = models.ForeignKey("users.Profile", default=None, blank=True, null=True, on_delete=models.CASCADE, related_name="messages")
    
    #to track token usage
    llm =  models.CharField(max_length = 24, null=True, blank=True )
    
    chat_model= models.TextField(blank=True, null=True)


