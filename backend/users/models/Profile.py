from django.db import models
from datetime import timezone
from django.utils import timezone
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.conf import settings

from rest_framework.authtoken.models import Token


# post save to creat token on user creation
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if instance and created:
        Token.objects.create(user=instance)


class Profile(models.Model):
    """
    This object adds some auxillery fucntionality to the user object outside teh standard functionality
    it has a 1 to 1 relationship with user

    """

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, blank=True, null=True, related_name="profile"
    )

    phone = models.CharField(max_length=24, null=True, blank=True)

    verified = models.BooleanField(null=True, blank=True, default=False)

    emailVerificationCode = models.CharField(max_length=128, null=True, blank=True)

    dateCreated = models.DateTimeField(default=timezone.now)

    tempPassword = models.CharField(max_length=128, null=True, blank=True)
    # a json field for extra data
    metadata = models.TextField(blank=True, null=True)
    # a flag that tells the system if the user should reset their password due to having a temporary password
    changeTempPassword = models.BooleanField(null=True, blank=True, default=False)

    subscription = models.DateTimeField(default=timezone.now, null=True, blank=True)

    def __str__(self):
        return f"{str(self.user)} {self.pk}, date: {self.dateCreated}"
