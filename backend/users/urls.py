
from django.urls import path
from users.views import auth, register, forgot_password, user_data, update_user, validate_user, google_auth
from rest_framework.authtoken.views import obtain_auth_token


urlpatterns = [
    #this is the default rest log in it takes in username and password
    path("default/login/", obtain_auth_token, name="default_login"),
    
    # checks the email to see if a user exists 
    path("email/check/", validate_user.EmailExist.as_view(), name="email_check"),
    
    # this is the custom class its a child of the above class
    # it updates the timestamp for new log ins to prevent timeouts mid session
    # additonally it can be used to control what data is returned as well as the format
    path("email/login/", auth.CustomAuthToken.as_view(), name="email_login"),
    
    path("google/login/", google_auth.GoogleAuth.as_view(), name="google_login"),
    # logout function just deletes token
    path("logout/", auth.LogOut.as_view(), name="log_out"),
    # standard register route returns same info as log in
    path("register/", register.SignUpAPIView.as_view(), name="register"),
    # handles the forgot password flow
    path("forgot-password/", forgot_password.ForgotPassword.as_view(), name="forgot-password"),
    
    path("change/password/", auth.ChangePassword.as_view(), name="change-password"),
    # this route sends the verification email to the user, this is used to allow the user to log in
    path("validate/email/", validate_user.ValidateUserEmailFromEmail.as_view(), name="send-validate-email"),
    # confirms the verification code sent in the validate/email/ route, this is used to allow the user to log in
    path("validate/confirm/", validate_user.ValidateUserConfirmWithEmail.as_view(), name="confirm-validate-email"),
    #updates the user and profile data
    path("update/user/", update_user.updateUserAPIView.as_view(), name="update-user"),
    # used for testing, sends up user data if authenticated
    path("getdata/", user_data.getUserData.as_view(), name="get_user_data")
]


    # alternate verirfication routes that require authentication
    # # this route sends the verification email to the user 
    # path("validate/email/", validate_user.ValidateUserEmail.as_view(), name="send-validate-email"),
    # # confirms the verification code sent in the validate/email/ route
    # path("validate/confirm/", validate_user.ValidateUserConfirm.as_view(), name="confirm-validate-email"),
