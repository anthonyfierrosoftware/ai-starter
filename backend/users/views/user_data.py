from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from utility.helpers.response import generate_response
from users.middleware.expiring_token_auth import ExpiringTokenAuthentication
from users.serializers.user_serializers import UserUpdateSerializer
from aiModule.serializers.conversation_serializers import UserDataConversationSerializer



import json

class getUserData(APIView):
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        '''
        This class is for testing not production use
        returns user data used to test auth classes
        '''
        try:

            userData = UserUpdateSerializer(request.user, many=False).data
                
            try:
                conversations = request.user.profile.conversations
                conversations = UserDataConversationSerializer(conversations, many=True).data
            except Exception as e:
                print(f"Error retirieving conversations in getUserData: {e}")
                
            ret={
                "userData":userData,
                "conversations":conversations
            }
            
            return generate_response(status=200, data=ret, custom_message=None)

            
            
        except Exception as e:
            print(f"error getting user data:{e}")                
            return generate_response(status=500, data=str(e)+".", custom_message="Could not get user")
        
        