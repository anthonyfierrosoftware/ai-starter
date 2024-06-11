
from django.urls import path
from users.views import auth, register, forgot_password, user_data, validate_user
from rest_framework.authtoken.views import obtain_auth_token


urlpatterns = [
    path("api/login/", obtain_auth_token, name="login"),

    # TODO - unused route? remove?    
    # path("api/check-email-exists/", validate_user.EmailExist.as_view(), name="email_check"),
    
    # this is the custom class its a child of the above class
    # it updates the timestamp for new log ins to prevent timeouts mid session
    # additonally it can be used to control what data is returned as well as the format
    path("email/login/", auth.CustomAuthToken.as_view(), name="email_login"),
    
    # logout function just deletes token
    path("logout/", auth.LogOut.as_view(), name="log_out"),
    # standard register route returns same info as log in
    path("register/", register.SignUpAPIView.as_view(), name="register"),
    # handles the forgot password flow
    path("forgot-password/", forgot_password.ForgotPassword.as_view(), name="forgot-password"),
    
    path("api/change-password/", auth.ChangePassword.as_view(), name="change-password"),

    # TODO - unused route? remove?
    # this route sends the verification email to the user, this is used to allow the user to log in
    #path("validate/email/", validate_user.ValidateUserEmailFromEmail.as_view(), name="send-validate-email"),
    
    # TODO - unused route? remove?
    # confirms the verification code sent in the validate/email/ route, this is used to allow the user to log in
    #path("validate/confirm/", validate_user.ValidateUserConfirmWithEmail.as_view(), name="confirm-validate-email"),

    #updates the user and profile data
    # path("api/user/", update_user.updateUserAPIView.as_view(), name="update-user"),
    # used for testing, sends up user data if authenticated
    path("api/user/", user_data.UserData.as_view(), name="user_data")
]


    # alternate verirfication routes that require authentication
    # # this route sends the verification email to the user 
    # path("validate/email/", validate_user.ValidateUserEmail.as_view(), name="send-validate-email"),
    # # confirms the verification code sent in the validate/email/ route
    # path("validate/confirm/", validate_user.ValidateUserConfirm.as_view(), name="confirm-validate-email"),
