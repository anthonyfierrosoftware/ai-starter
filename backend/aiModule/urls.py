from django.urls import path
from aiModule.views import basicChat, conversation


urlpatterns = [
    path("chat/send/", basicChat.ChatComplete.as_view(), name="send_chat"),
    path(
        "conversations/", conversation.getConversations.as_view(), name="send_chat"
    ),
    path(
        "conversations/<int:pk>/",
        conversation.getConversation.as_view(),
        name="send_chat",
    ),
]
