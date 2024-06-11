from django.apps import AppConfig


class AIModuleConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'aiModule'
    
    def ready(self):
        import aiModule.signals
