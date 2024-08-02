from django.urls import path
from aiModule.views import basicChat, conversation


urlpatterns = [
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
