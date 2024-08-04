from django.contrib.auth.models import User
from rest_framework import serializers
from django.db.models.functions import Lower
from django.contrib.auth.forms import UserCreationForm
from rest_framework.authtoken.models import Token

from users.serializers.profile_serializers import (
    ProfileRegisterSerializer,
    ProfileUpdateSerializer,
)


class UserRegisterSerializer(UserCreationForm):
    """
    User Serializer used for registration of a user.
    It is technically a form as to use djangos default functionality


    """

    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "email",
            "password1",
            "password2",
        ]

    def clean(self):
        """
        validate user data
        """
        super(UserCreationForm, self).clean()

        username = self.cleaned_data.get("username")
        email = self.cleaned_data.get("email")

        if (
            username
            and User.objects.annotate(username_lower=Lower("username"))
            .filter(username_lower=(username).lower())
            .exists()
        ):
            self._errors["username"] = self.error_class(
                ["This username is already taken please choose another."]
            )

        if email and User.objects.filter(email=email).exists():
            self._errors["email"] = self.error_class(
                ["This email is already taken please choose another."]
            )

        return self.cleaned_data


class UserResponseSerializer(serializers.ModelSerializer):
    """
    User Serializer used for gsending up data of a user.


    """

    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "username", "pk"]

    # this just appends the profile if it exists, you can remove it
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        try:
            if instance.profile:
                ret["profile"] = ProfileUpdateSerializer(instance.profile).data
            else:
                ret["profile"] = None

            ret["token"], created = Token.objects.get_or_create(user=instance)
            ret["token"] = str(ret["token"])

        except Exception as e:
            print(f"Error in to_rep in user serializer: {e}")

        return ret


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    User Serializer used for updating of a user.


    """

    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "username"]

    # this just appends the profile if it exists, you can remove it
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        try:
            if instance.profile:
                ret["profile"] = ProfileUpdateSerializer(instance.profile).data
            else:
                ret["profile"] == None

            ret["pk"] = instance.pk

        except Exception as e:
            print(f"Error in to_rep in user serializer: {e}")

        return ret

    def validate(self, data):
        """
        validate user data
        """
        # check to ensure unique + profanity
        error_dict = {}

        instance = getattr(self, "instance", None)

        if (
            "username" in data
            and User.objects.annotate(username_lower=Lower("username"))
            .filter(username_lower=(data["username"]).lower())
            .exclude(
                username=instance.username if instance and instance.username else None
            )
            .exists()
        ):
            error_dict["username"] = "This username is taken."

        if (
            "email" in data
            and User.objects.filter(email__iexact=data["email"])
            .exclude(email=instance.email if instance and instance.email else None)
            .exists()
        ):
            error_dict["email"] = "Email already taken."

        if error_dict != {}:
            raise serializers.ValidationError(error_dict)

        return data
