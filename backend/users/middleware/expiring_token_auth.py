from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authtoken.models import Token
from datetime import date, datetime, timedelta, timezone

class ExpiringTokenAuthentication(TokenAuthentication):
    '''
    custom authentication class built on top of standard token authentication
    Esentially it just deletes the token after a week causing the user to refresh
    '''
    def authenticate_credentials(self, key):
        
        try:
            token = Token.objects.get(key=key)
        except Token.DoesNotExist:
            raise AuthenticationFailed('Invalid token')

        if not token.user.is_active:
            raise AuthenticationFailed('User inactive or deleted')

        # This is required for the time comparison
        utc_now = datetime.now(timezone.utc)

        if token.created < utc_now - timedelta(days=7):

            token.delete()

        return token.user, token