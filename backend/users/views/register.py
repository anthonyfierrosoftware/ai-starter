
from django.apps import apps
from rest_framework.views import APIView
from utility.helpers.response import generate_response, error_list_object
from users.serializers.user_serializers import UserRegisterSerializer, UserResponseSerializer
from users.serializers.profile_serializers import ProfileRegisterSerializer
from django.contrib.auth.models import User


import json

class SignUpAPIView(APIView):
    
    def post(self, request):
        '''
        creates user object returns a serialized version with the user profile nested within
        allows a user to sign up

        User Data
        username: the username
        password: password
        first_name: String 
        last_name: String
        email: String
        
        Profile Data 
        Is created in serilaizers
        '''
        try:
            user = None
            data = json.loads(request.body)
            serializer = UserRegisterSerializer(data=data)
            # check if valid create objects
            if serializer.is_valid():
                user = serializer.save()
                user.set_password(data["password1"])
                
                # update data to have user object
                data['user'] = user.pk
                
                #this serializer is only to create the profile if you would like to update as well please add the fields in the serializer
                profile_serializer = ProfileRegisterSerializer(data=data)
                if profile_serializer.is_valid(raise_exception=True):
                    profile_serializer.save()
                    
                try:
                    user = User.objects.get(pk=user.pk)
                    ret = UserResponseSerializer(user).data
                    custom_msg = None
                except Exception as e:
                    ret=None
                    custom_msg = f"User created but there was an error serializing their data: {e}."
                    print(f"error in custom Auth token serializing: {e}")
                
                return generate_response(status=201, data=ret, custom_message=custom_msg)
            
            # use to remove validation_error formatting for easy extraction
            errors = json.loads(serializer.errors.as_json())
            ret =[]
            for error in errors:
                # the following code allows for multiple errors to be formatted and sent up (currently only the first is processed)
                # temp = []
                # for e in errors[error]:
                #     temp.append(e["message"])
                # ret.append(error_list_object(error, temp))
                
                # swapping error check to go against first password (by default django uses password2)
                title = str(error)
                if title == "password2":
                    title = "password1"
                elif title == "password1" :
                    title = "password2"
                    
                ret.append(error_list_object(title, str(errors[error][0]["message"])))


            return generate_response(status=422, data=ret, custom_message=None)
            
            
        except Exception as e:
            print(f"error registering new user:{e}")
            if user:
                user.delete()
                
            return generate_response(status=500, data=str(e)+".", custom_message="Could not register user")

