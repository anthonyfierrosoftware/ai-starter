from django.apps import apps


from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from utility.helpers.response import generate_response
from users.middleware.expiring_token_auth import ExpiringTokenAuthentication
from aiModule.serializers.conversation_serializers import (
    ConversationSerializer,
    ConversationWithMessagesSerializer,
)




class getConversations(APIView):
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        returns all conversations from user
        """
        try:

            conversations = request.user.profile.conversations.all()

            ret = ConversationSerializer(conversations, many=True).data

            return generate_response(status=200, data=ret, custom_message=None)

        except Exception as e:
            print(f"error getting user data:{e}")
            return generate_response(
                status=500, data=str(e) + ".", custom_message="Could not get user"
            )


class getConversation(APIView):
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """
        returns conversation from pk
        """
        try:

            try:
                conversation = apps.get_model("aiModule.Conversation").objects.get(
                    pk=pk
                )
            except Exception as e:
                print(f"Error parsing data in getConversation:  {e}")
                return generate_response(
                    status=400,
                    data="Error retrieving conversation.",
                    custom_message=f"Error: {e}",
                )

            ret = ConversationWithMessagesSerializer(conversation).data

            return generate_response(status=200, data=ret, custom_message=None)

        except Exception as e:
            print(f"error getting user data:{e}")
            return generate_response(
                status=500, data=str(e) + ".", custom_message="Could not get user"
            )
