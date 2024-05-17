from rest_framework import serializers
from aiModule.models.llmConfig import LLMConfiguration
from aiModule.models.llmConfig import LLM, MODELS, LLM_MODEL

import re
import json

class ConfigSerializer(serializers.ModelSerializer):
    '''
    Used to prep and send data to front
    
    '''
    
    class Meta:
        model = LLMConfiguration
        fields = ["apiKey","llm", "chat_model", "dateCreated", "lastUpdated", "systemInstructions"] 
        
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        try:            
            ret["pk"] = instance.pk
            
        except Exception as e:
            print(f"Error in to_rep in ConfigSerializer: {e}")
            
        return ret
    
    def validate(self,data):
        """
        validate user data
        """
        error_dict = {}

        
        if "llm" in data and data["llm"] not in LLM:
            error_dict["llm"] = f"Please enter a valid llm options {str(LLM)}"
            
            
        if "llm" in data and "chat_model" not in data:
            error_dict["chat_model"] = f"Please specify a chat_model when updating the llm, options: {str(LLM_MODEL)}"
        
        if "chat_model" in data and "llm" not in data:
            error_dict["llm"] = f"Please specify a llm when updating the chat_model, options: {str(LLM_MODEL)}"
          
        if "chat_model" in data and data["chat_model"] not in MODELS:
            error_dict["chat_model"] = f"Please enter a valid llm options {str(MODELS)}"

        if "llm" in data and "chat_model" in data and data["llm"] in LLM and data["chat_model"] not in LLM_MODEL[data["llm"]]:
            error_dict["chat_model"] = f"llm and chat_model do not match, options: {str(LLM_MODEL)}"
            

        if error_dict != {}:
            raise serializers.ValidationError(error_dict)
        return data