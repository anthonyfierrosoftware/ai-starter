from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from utility.helpers.response import generate_response
from users.middleware.expiring_token_auth import ExpiringTokenAuthentication
from users.serializers.user_serializers import UserUpdateSerializer
from aiModule.serializers.conversation_serializers import UserDataConversationSerializer

from django.shortcuts import render
from django.apps import apps

from django.utils import timezone
from django.db.models import Sum, Count, Q

from rest_framework.views import APIView
from utility.helpers.response import generate_response, error_list_object
from users.serializers.user_serializers import (
    UserUpdateSerializer,
    UserResponseSerializer,
)
from users.serializers.profile_serializers import ProfileUpdateSerializer

from users.middleware.expiring_token_auth import ExpiringTokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User

import json

import json


class UserData(APIView):
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        This class is for testing not production use
        returns user data used to test auth classes
        """
        try:

            userData = UserUpdateSerializer(request.user, many=False).data

            try:
                conversations = request.user.profile.conversations
                conversations = UserDataConversationSerializer(
                    conversations, many=True
                ).data
            except Exception as e:
                print(f"Error retirieving conversations in getUserData: {e}")

            ret = {"userData": userData, "conversations": conversations}

            return generate_response(status=200, data=ret, custom_message=None)

        except Exception as e:
            print(f"error getting user data:{e}")
            return generate_response(
                status=500, data=str(e) + ".", custom_message="Could not get user"
            )

    def put(self, request):
        """
        updates user object returns a serialized version with the user profile nested within

        User Data
        username: the username
        password: password
        first_name: String
        last_name: String
        email: String

        Profile Data
        phone: string

        """

        try:
            user = request.user
            if not request.user.is_authenticated:
                return generate_response(
                    status=403, data=None, custom_message="User not authenticated"
                )

            try:
                data = json.loads(request.body)
                temp = {**data}
                for ele in temp:
                    if not temp[ele] or str(temp[ele]) == "":
                        del data[ele]

            except Exception as e:
                return generate_response(
                    status=400,
                    data="Error parsing data please refer to custom message for details",
                    custom_message=str(e),
                )

            # Handle meta data
            try:
                if "metadata" in data:
                    data["metadata"] = json.dumps(data["metadata"])
            except Exception as e:
                print(f"error updating user:{str(e)}")
                return generate_response(
                    status=422,
                    data=error_list_object(
                        "Metadata",
                        "Could not process meta data please ensure it is correctly formatted.",
                    ),
                    custom_message=str(e) + ".",
                )

            serializer = UserUpdateSerializer(user, data=data, partial=True)
            profile_serializer = ProfileUpdateSerializer(
                user.profile, data=data, partial=True
            )

            serializer.is_valid()
            profile_serializer.is_valid()

            # only grabs first error for each message
            ret = []
            for err in serializer.errors:

                try:
                    ret.append(error_list_object(err, str(serializer.errors[err][0])))
                except Exception as e:
                    print(f"error processing serializer errors: {e}")

            for err in profile_serializer.errors:

                try:
                    ret.append(
                        error_list_object(err, str(profile_serializer.errors[err][0]))
                    )
                except Exception as e:
                    print(f"error processing serializer errors: {e}")

            if not ret:
                user = serializer.save()
                profile_serializer.save()

                user = User.objects.get(pk=user.pk)
                return generate_response(
                    status=200,
                    data=UserResponseSerializer(user).data,
                    custom_message=None,
                )

            return generate_response(status=422, data=ret, custom_message=None)

        except Exception as e:
            print(f"error updating user:{e}")
            return generate_response(
                status=500, data=str(e) + ".", custom_message="Could not register user"
            )
