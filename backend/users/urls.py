from django.urls import path
from users.views import auth, register, forgot_password, user_data, validate_user
from rest_framework.authtoken.views import obtain_auth_token


urlpatterns = [
    path("api/login/", obtain_auth_token, name="login"),
    path("api/check-email-exists/", validate_user.EmailExist.as_view(), name="email_check"),
    path("email/login/", auth.CustomAuthToken.as_view(), name="email_login"),
    path("logout/", auth.LogOut.as_view(), name="log_out"),
    path("register/", register.SignUpAPIView.as_view(), name="register"),
    path(
        "forgot-password/",
        forgot_password.ForgotPassword.as_view(),
        name="forgot-password",
    ),
    path("api/change-password/", auth.ChangePassword.as_view(), name="change-password"),
    # this route sends the verification email to the user, this is used to allow the user to log in
    path("validate/email/", validate_user.ValidateUserEmailFromEmail.as_view(), name="send-validate-email"),
    # confirms the verification code sent in the validate/email/ route, this is used to allow the user to log in
    path("validate/confirm/", validate_user.ValidateUserConfirmWithEmail.as_view(), name="confirm-validate-email"),
    # updates the user and profile data
    # path("api/user/", update_user.updateUserAPIView.as_view(), name="update-user"),
    # used for testing, sends up user data if authenticated
    path("api/user/", user_data.UserData.as_view(), name="user_data"),
]
