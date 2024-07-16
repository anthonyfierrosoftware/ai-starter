from django.dispatch import receiver
from django.db.models.signals import post_save
from datetime import datetime, timezone
from aiModule.models.Conversation import Conversation


@receiver(post_save, sender=Conversation, dispatch_uid="conversation_last_updated")
def last_updated(sender, instance, **kwargs):
    """
    update last update field
    """

    is_disconnected = post_save.disconnect(
        last_updated, sender=Conversation, dispatch_uid="conversation_last_updated"
    )
    if is_disconnected and instance:
        instance.last_updated = datetime.now(timezone.utc)
        instance.save()

    post_save.connect(
        last_updated, sender=Conversation, dispatch_uid="conversation_last_updated"
    )
