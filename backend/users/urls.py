from django.urls import path
from users.views import auth, register, forgot_password, user_data, validate_user
from rest_framework.authtoken.views import obtain_auth_token


urlpatterns = [
    path("login/", obtain_auth_token, name="login"),
    path("check-email-exists/", validate_user.EmailExist.as_view(), name="email_check"),
    path("email/login/", auth.CustomAuthToken.as_view(), name="email_login"),
    path("logout/", auth.LogOut.as_view(), name="log_out"),
    path("register/", register.SignUpAPIView.as_view(), name="register"),
    path(
        "forgot-password/",
        forgot_password.ForgotPassword.as_view(),
        name="forgot-password",
    ),
    path("change-password/", auth.ChangePassword.as_view(), name="change-password"),
    # this route sends the verification email to the user, this is used to allow the user to log in
    path("validate/email/", validate_user.ValidateUserEmailFromEmail.as_view(), name="send-validate-email"),
    # confirms the verification code sent in the validate/email/ route, this is used to allow the user to log in
    path("validate/confirm/", validate_user.ValidateUserConfirmWithEmail.as_view(), name="confirm-validate-email"),
    # used for testing, sends up user data if authenticated
    path("user/", user_data.UserData.as_view(), name="user_data"),
]
