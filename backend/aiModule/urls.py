from django.urls import path
from aiModule.views import basicChat, conversation


urlpatterns = [
    # this is the default rest log in it takes in username and password
    path("chat/send/", basicChat.ChatComplete.as_view(), name="send_chat"),
    path(
        "get/conversations/", conversation.getConversations.as_view(), name="send_chat"
    ),
    path(
        "get/conversations/<int:pk>/",
        conversation.getConversation.as_view(),
        name="send_chat",
    ),
]
