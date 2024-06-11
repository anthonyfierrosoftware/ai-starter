from django.apps import apps
from django.template.loader import render_to_string

from django.contrib.auth.models import User
from django.utils import timezone
from django.contrib.sites.shortcuts import get_current_site

from rest_framework.views import APIView
from utility.helpers.response import generate_response, error_list_object
from utility.helpers.util_tools import random_with_N_digits

from users.middleware.expiring_token_auth import ExpiringTokenAuthentication
from users.serializers.user_serializers import UserResponseSerializer
from rest_framework.permissions import IsAuthenticated
from django.core.mail import EmailMessage

import json
import hashlib


class EmailExist(APIView):

    def post(self, request):
        """
        this route takes an email and tells you if a user exists
        """
        try:
            try:
                data = json.loads(request.body)
                User.objects.get(email__iexact=data["email"])
                return generate_response(
                    status=200, data=None, custom_message="Email Found"
                )
            except Exception as e:
                return generate_response(
                    status=400,
                    data="Email not found",
                    custom_message="A user account with this email does not exist",
                )
        except Exception as e:
            print(f"error sending verification email:{e}")
            return generate_response(
                status=500, data=str(e) + ".", custom_message="Could not check email"
            )


class ValidateUserEmail(APIView):
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        send email with validation code to user
        generates new code every time
        sends a 202 if they are already verified
        """
        try:
            user = request.user
            if not request.user.is_authenticated:
                return generate_response(
                    status=403, data=None, custom_message="User not authenticated"
                )

            if user.profile.verified:
                return generate_response(
                    status=200,
                    data=UserResponseSerializer(user).data,
                    custom_message="Email is already verified",
                )

            valid_pass = random_with_N_digits(6)
            hash = hashlib.sha256()
            hash.update(str(valid_pass).encode())
            hashed_pass = str(hash.hexdigest())

            user.profile.emailVerificationCode = hashed_pass
            user.profile.save()

            # send email
            if emailVerificationCode(request, user, valid_pass):
                return generate_response(
                    status=201,
                    data=UserResponseSerializer(user).data,
                    custom_message="Email Sent",
                )

            return generate_response(
                status=500,
                data=None,
                custom_message="Verification email was unable to send: please check email config.",
            )

        except Exception as e:
            print(f"error sending verification email:{e}")
            return generate_response(
                status=500,
                data=str(e) + ".",
                custom_message="Could not send validation email",
            )


class ValidateUserConfirm(APIView):
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        checks code against users validation code then updates profile.verified
        sends a 202 if they are already verified

        Receives
        code: the verification code sent to the user

        """
        try:
            user = request.user
            data = json.loads(request.body)
            if not request.user.is_authenticated:
                return generate_response(
                    status=403, data=None, custom_message="User not authenticated"
                )

            if not user.profile.emailVerificationCode:
                return generate_response(
                    status=412,
                    data=None,
                    custom_message="User has not requested a verification email yet: No Code",
                )

            if user.profile.verified:
                return generate_response(
                    status=202,
                    data=UserResponseSerializer(user).data,
                    custom_message="Email is already verified",
                )

            try:
                hash = hashlib.sha256()
                hash.update(str(data["code"]).encode())

                if str(hash.hexdigest()) == str(user.profile.emailVerificationCode):
                    user.profile.emailVerificationCode = None
                    user.profile.verified = True
                    user.profile.save()
                    return generate_response(
                        status=200,
                        data=UserResponseSerializer(user).data,
                        custom_message="user Verified",
                    )

                return generate_response(
                    status=406,
                    data=error_list_object("Verification Code", "Code did not match."),
                    custom_message="Code mismatch",
                )
            except Exception as e:
                print(f"error processing verification code:{e}")
                return generate_response(
                    status=422,
                    data=error_list_object(
                        "Verification Code", "Could not retrieve verification code."
                    ),
                    custom_message=str(e),
                )

        except Exception as e:
            print(f"error confirming user verification:{e}")
            return generate_response(
                status=500,
                data=str(e) + ".",
                custom_message="Could not confirm user validation.",
            )


class ValidateUserEmailFromEmail(APIView):
    def post(self, request):
        """
        same as ValidateUserEmail but doesnt need a token instead it just uses the email to trigger sending the email
        """
        try:

            try:
                data = json.loads(request.body)
                user = User.objects.get(email__iexact=data["email"])
            except Exception as e:
                return generate_response(
                    status=403,
                    data=None,
                    custom_message=f"Error retrieving user from email: {e}.",
                )

            valid_pass = random_with_N_digits(6)
            hash = hashlib.sha256()
            hash.update(str(valid_pass).encode())
            hashed_pass = str(hash.hexdigest())

            user.profile.emailVerificationCode = hashed_pass
            user.profile.save()

            # send email
            if emailVerificationCode(request, user, valid_pass):
                return generate_response(
                    status=201, data=None, custom_message="Email Sent"
                )

            return generate_response(
                status=500,
                data=None,
                custom_message="Verification email was unable to send: please check email config.",
            )

        except Exception as e:
            print(f"error sending verification email:{e}")
            return generate_response(
                status=500,
                data=str(e) + ".",
                custom_message="Could not send validation email.",
            )


class ValidateUserConfirmWithEmail(APIView):
    def post(self, request):
        """
        same as ValidateUserConfirm but uses just an email + the code and returns an auth token with user information
        can be used to simulate logging in

        """
        try:
            try:
                data = json.loads(request.body)
                user = User.objects.get(email__iexact=data["email"])
            except Exception as e:
                return generate_response(
                    status=403, data=None, custom_message="User not authenticated"
                )

            if not user.profile.emailVerificationCode:
                return generate_response(
                    status=412,
                    data=None,
                    custom_message="User has not requested a verification email yet: No Code.",
                )

            try:
                hash = hashlib.sha256()
                hash.update(str(data["code"]).encode())

                if str(hash.hexdigest()) == str(user.profile.emailVerificationCode):

                    # informs front end if the user is a first time log in
                    if user.profile.verified:
                        user.profile.emailVerificationCode = None
                        user.profile.save()
                        return generate_response(
                            status=202,
                            data=UserResponseSerializer(user).data,
                            custom_message="Email is already verified",
                        )

                    user.profile.emailVerificationCode = None
                    user.profile.verified = True
                    user.profile.save()
                    return generate_response(
                        status=200,
                        data=UserResponseSerializer(user).data,
                        custom_message="user Verified",
                    )

                return generate_response(
                    status=406,
                    data=error_list_object("Verification Code", "Code did not match."),
                    custom_message="Code mismatch",
                )
            except Exception as e:
                print(f"error processing verification code:{e}")
                return generate_response(
                    status=422,
                    data=error_list_object(
                        "Verification Code", "Could not retrieve verification code."
                    ),
                    custom_message=str(e),
                )

        except Exception as e:
            print(f"error confirming user verification:{e}")
            return generate_response(
                status=500,
                data=str(e) + ".",
                custom_message="Could not confirm user validation",
            )


def emailVerificationCode(request, user, valid_pass):
    """
    Send of the verification email
    """

    current_site = get_current_site(request)
    user = user
    email = user.email
    subject = f"WorldClass Verification Code"
    message = render_to_string(
        "emails/email_verification.html",
        {
            "request": request,
            "user": user,
            "temp_password": valid_pass,
            "domain": current_site.domain,
        },
    )
    email = EmailMessage(subject, message, to=[email])
    email.content_subtype = "html"
    email.send()

    return True
