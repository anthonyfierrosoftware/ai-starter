
from django.urls import path
from utility.views import revcat_webhook


urlpatterns = [
    #this is the default rest log in it takes in username and password
    path("revcat/webhook/", revcat_webhook.RevenueCatWebhook.as_view(), name="revcatWebhook"),
    
]
