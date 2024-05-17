from datetime import date, datetime, timedelta, timezone
from django.contrib.auth.models import User 
from users.serializers.user_serializers import UserResponseSerializer
from django.conf import settings
from django.apps import apps
from utility.helpers.response import generate_response, error_list_object
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authtoken.models import Token
from rest_framework import serializers

# google stuff 
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

# import datetime
import random
import json
import uuid

class GoogleSocialAuthSerializer(serializers.Serializer):
    '''
    handles google authentication
    '''
    auth_token = serializers.CharField()

    def validate_auth_token(self, auth_token):

        # uses helper class to validate token 
        user_data = Google.validate(auth_token)


        # check token is valid 
        try:
            user_data['sub']
        except:
            raise AuthenticationFailed('401')


        #use to validate the origin of the token
        # if "aud" in user_data:
        #     print("------------------------------------------------------------------------------------------------")
        #     print(user_data['aud'])
        #     print("------------------------------------------------------------------------------------------------")
        # if user_data['aud'] != settings.GOOGLE_CLIENT_ID:
        #     raise AuthenticationFailed("oops,who are you?")

        # grab data
        user_id = user_data["sub"]
        email= user_data['email']
        #username **
        name = user_data['name'].replace(" ", "_")
        try:
            first_name= user_data['given_name']
        except:
            first_name = None

        try:
            last_name = user_data['family_name']
        except:
            last_name= None
            
        provider = 'google'

        # returns the results of the helper function register_social_user: this either creates them a user object or logs them in  
        return register_google_user(user_id =user_id, email=email, name=name, first_name = first_name, last_name = last_name)

class GoogleAuth(APIView):
    '''
    Takes in an auth token from google checks its origina dn verifies it then authenticates the user and sends back up a valid token
    '''

    serializer_class= GoogleSocialAuthSerializer

# takes the idtoken provided from google and authenticates user returns users proper token for our system
    def post(self,request):
        try:
            serializer = self.serializer_class(data=json.loads(request.body))
            # check if valid create objects
            if serializer.is_valid(raise_exception=True):
                # handle token 
                
                data= serializer.validated_data['auth_token']
                
                # print(serializer.validated_data['auth_token'])
                
                token, created =  Token.objects.get_or_create(user=data["user_data"]['pk'])
                if not created:
                    # Update created time of token to keep it valid
                    token.created = datetime.now(timezone.utc)
                    token.save()
                    
                # refresh user in case of token
                user= User.objects.get(pk=token.user.pk)
                
                # we dont need this if you dont need to differentiate
                if bool(int(data["new"])):
                    return generate_response(status=201, data= UserResponseSerializer(user).data , custom_message=None)
                
                return generate_response(status=200, data=UserResponseSerializer(user).data, custom_message=None)

            return generate_response(status=401, data="Google Authentication failed.", custom_message=None )

        except AuthenticationFailed as e:
            return generate_response(status=401, data=f"Google Authentication failed: {e}", custom_message=None )

        except Exception as e:
            print(f"Error logging in user with google auth: {e}")
            return generate_response(status=500, data=None, custom_message=str(e))
        
        
        


class Google:
    '''
    validate user with google --------------------------------------------------
    fetches user info and returnes it 
    '''

    @staticmethod
    def validate(auth_token):

        try: 
            idinfo = id_token.verify_oauth2_token(auth_token, google_requests.Request())
            # checks if token is issued from google 
            if 'accounts.google.com' in idinfo['iss']:
                # print(f"verified success, data: {idinfo}")
                return idinfo

            print("Google could not validate token returning false")
            return False
        except Exception as e:
            print(f"Error: Google could not validate token returning false: {e}")
            return False
        
    
# helper function ------------------------------------------------------------- 
def register_google_user( user_id, email, name, first_name, last_name):
    '''
    registers a user from google auth info
    '''
    # get user from email  
    try:
        registered_user = User.objects.get(email=email)
    except:
        registered_user = None

    # check if user exists
    if registered_user:

        # handle google 
        if registered_user.profile.verified:
            return user_json_data(registered_user)
        else:
            registered_user.profile.verified= True
            registered_user.profile.save()
            return user_json_data(registered_user)
            

    # user doesnt exist create new user
    else:
        password = str(uuid.uuid4())
        user = {
            'username': generate_username(name),
            'email': email,
            # 'password':password,
            'first_name':first_name,
            'last_name': last_name
        }
        # create user object 
        new_user = User.objects.create_user(**user)
        # set as random user id
        new_user.set_password(password)
        
        # create profile 
        if new_user:
            profile= apps.get_model("users.Profile").objects.create(user=new_user, verified=True)
            profile.email_verified = True
            profile.save()

        try:
            return user_json_data(new_user, True)
            
        
        except Exception as e:
            print(f"Error in register google users:{e}")
            return None
        
        
        
def generate_username(name):
    '''
    Used to generate a random user name for google authentication
    '''

    username = "".join(name.split(' ')).lower()
    if not User.objects.filter(username=username).exists():
        return username
    else:
        random_username = username + str(random.randint(0, 1000))
        return generate_username(random_username)
    
    
    
def user_json_data(user, new=False):
    '''
    retrieves and formats data from google auth
    and returns as a string
    '''
    
    return {
        "user_data":UserResponseSerializer(user).data,
        "new":str(int(new))
    }
    
    return 