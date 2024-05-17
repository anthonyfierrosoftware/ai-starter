from django.dispatch import receiver
from django.db.models.signals import post_save
from datetime import date, datetime, timedelta, timezone
from aiModule.models.Conversation import Conversation




@receiver(post_save, sender = Conversation, dispatch_uid = "conversation_lastUpdated")
def last_updated(sender, instance, **kwargs):
    '''
    update last update field
    '''
    
    is_disconnected = post_save.disconnect(
                        last_updated,
                        sender=Conversation,
                        dispatch_uid="conversation_lastUpdated")
    if is_disconnected and instance:
        instance.lastUpdated = datetime.now(timezone.utc)
        instance.save()
        
    post_save.connect(
        last_updated,
        sender=Conversation,
        dispatch_uid="conversation_lastUpdated")