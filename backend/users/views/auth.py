from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from utility.helpers.response import generate_response, error_list_object
from django.contrib.auth.models import User

from django.contrib.auth.password_validation import validate_password

from users.serializers.user_serializers import UserResponseSerializer

from rest_framework.views import APIView

from django.apps import apps
from datetime import datetime, timezone
from users.middleware.expiring_token_auth import ExpiringTokenAuthentication
from rest_framework.permissions import IsAuthenticated

import json
import hashlib


class ChangePassword(APIView):
    """
    Allows user to change their password

    Takes a password and then uses the authenticated user to update the password
    Uses the default django auth module to validate. validators can be added in settings.py
    expects: password1, password2, old_password

    password1
    password2
    old_password
    """

    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        try:
            user = request.user
            data = json.loads(request.body)

            try:
                password1 = data["password1"]
                password2 = data["password2"]

                old_password = data["old_password"]

            except Exception as e:
                print(f"Error Change Password could not retrieve data: {e}")
                ret = error_list_object(
                    "Password", "Could not retrieve required data from body."
                )
                return generate_response(
                    status=422, data=ret, custom_message="Invalid Request"
                )

            if not password1 == password2:
                ret = error_list_object("Password1", "Passwords do not match")
                return generate_response(
                    status=422, data=ret, custom_message="Invalid password"
                )
            try:
                test = user.check_password(old_password)
                if not test:
                    ret = error_list_object("Password", "Previous password is invalid")
                    return generate_response(
                        status=422, data=ret, custom_message="Invalid password"
                    )
            except Exception as e:
                ret = error_list_object("Password", "Previous password is invalid")
                return generate_response(
                    status=422, data=ret, custom_message="Invalid password"
                )

            if password1:

                try:
                    validate_password(password1, user=user)
                except Exception as e:
                    print(f"Error changing password: {e}")

                    ret = error_list_object("Password1", list(e)[0])
                    return generate_response(
                        status=422, data=ret, custom_message="Invalid password"
                    )

                user.set_password(password1)
                user.save()

                user.profile.change_temp_password = False
                user.profile.save()

            return generate_response(
                status=200, data=None, custom_message="password changed"
            )

        except Exception as e:
            print(f"System error chenging password: {e}")
            return generate_response(status=500, data=str(e) + ".", custom_message=None)


class LogOut(APIView):
    """
    Just grabs user deletes token
    """

    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        try:
            user = request.user
            user.auth_token.delete()

            return generate_response(
                status=200, data=None, custom_message="User is logged out"
            )

        except Exception as e:
            print(f"Error logging out : {e}")
            return generate_response(status=500, data=str(e) + ".", custom_message=None)


class CustomAuthToken(ObtainAuthToken):
    """
    This class is inherets from the default login functionality from django rest framework
    Updates the token to ensure user does not time out when starting a new session

    Forgot password: When user logs in check to see if the temp password is used
    if it is it will set that as the password then delete it
    otherise it will just delete it
    """

    def post(self, request, *args, **kwargs):
        try:
            payload = json.loads(request.body)
            try:

                user = User.objects.get(email__iexact=payload["email"])
                username = user.username

            except Exception as e:
                print("Login could not find user from email: {e}")
                error = [
                    error_list_object(
                        "Email", "The email and password you provided are incorrect."
                    )
                ]
                return generate_response(status=401, data=error, custom_message=None)

            # check for temp pass
            try:

                temp_pass = user.profile.temp_password

                hash = hashlib.sha256()
                hash.update(str(payload["password"]).encode())

                if str(hash.hexdigest()) == temp_pass:

                    user.set_password(payload["password"])
                    user.save()

                    user.profile.change_temp_password = True
                    user.profile.save()

            except Exception as e:
                print("temp_pass not found")

            data = {"username": username, "password": payload["password"]}

            serializer = self.serializer_class(data=data, context={"request": request})

            if serializer.is_valid():
                token, created = Token.objects.get_or_create(
                    user=serializer.validated_data["user"]
                )

                if not created:
                    token.created = datetime.now(timezone.utc)
                    token.save()

                # reset temp password user has logged in succesfully
                user.profile.temp_password = None
                user.profile.save()

                # Format data and return
                try:

                    data = UserResponseSerializer(user).data

                except Exception as e:
                    data = False
                    print(f"error in custom Auth token serializing: {e}")

                return generate_response(status=200, data=data, custom_message=None)

            else:

                # use this if you want dynamic errors sent up
                # errors=serializer.errors["non_field_errors"]
                # temp=[]
                # for error in errors:
                #     temp.append(error_list_object("Invalid Credentials", error))
                error = [
                    error_list_object(
                        "Email", "The username and password you provided are incorrect."
                    )
                ]
                return generate_response(status=401, data=error, custom_message=None)

        except Exception as e:
            print(f"error in CustomAuthToken: {e}")
            return generate_response(status=500, data=str(e) + ".", custom_message=None)
