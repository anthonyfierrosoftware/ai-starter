from django.contrib.auth.models import User
from rest_framework import serializers
from users.models import Profile


import re
import json


class ProfileRegisterSerializer(serializers.ModelSerializer):
    '''
    User Serializer used for registration of a user. Includes validation
    function to cxreate a token
    
    '''
    
    user = serializers.PrimaryKeyRelatedField( many=False, queryset=User.objects.all(), required=False, allow_null=True, default=None)
    
    class Meta:
        model = Profile
        fields = ["user"]

    
    
class ProfileUpdateSerializer(serializers.ModelSerializer):
    '''
    User Serializer used for updating of a user profile. Includes validation
    function to cxreate a token
    
    '''
    
    # read only is set to true profiles should not be swapped between users
    user = serializers.PrimaryKeyRelatedField( many=False, required=False, allow_null=True, default=None, read_only=True)
    
    class Meta:
        model = Profile
        fields = ["user","phone", "metadata", "verified", "changeTempPassword"] 
        
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        try:
            if ret["metadata"]:        
                ret["metadata"] = json.loads(ret["metadata"])
            else:
                ret["metadata"]=None
            
            
        except Exception as e:
            print(f"Error in to_rep in user serializer: {e}")
            
            
        return ret

    def validate(self,data):
        """
        validate user data
        """
        error_dict = {}
        
        pattern = re.compile(r"^(\+\d{1,3})?\s?\(?\d{1,4}\)?[\s.-]?\d{3}[\s.-]?\d{4}$")

        if "metadata" in data:
            try:
                json.loads(data["metadata"])
            except Exception as e:
                print("Profile error processing json: " + str(e))
                error_dict["metadata"] = "Error processing metadata, please make sure it is valid json."
                
        if "phone" in data and not re.search(pattern, data["phone"]):
            error_dict["phone"] = "Please enter a valid phone number."
        

        if error_dict != {}:
            raise serializers.ValidationError(error_dict)

        return data
    