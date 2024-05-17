from django.apps import apps


from django.contrib.auth.models import User
from django.http import HttpResponse
from rest_framework.views import APIView
from datetime import datetime, timezone, timedelta

import json
import os


def to_json(obj):
    return json.dumps(obj, default=lambda obj: obj.__dict__)


class RevenueCatWebhook(APIView): 
    '''
    Revenue cat webhook
    '''

    def post(self, request):
        '''
        handles revenue cat event objects
        registered with revenue cat webhooks

        '''
        
        try:
            data = json.loads(request.body)
            
            # check header 
            secret = request.META["HTTP_AUTHORIZATION"]
            if not secret == os.getenv("REVCAT_WEBHOOK_SECRET", False):
                print(f"request of unknown origin: {secret}")
                return HttpResponse(400)
            
            try:
                user = data["app_user_id"] or data["original_app_user_id"]
                user = User.objects.get(pk=data["app_user_id"])
            except Exception as e:
                print(f"Error could not retrieve user: {e}")
                return HttpResponse(status=400)
            
            try:
                exp_date= data["expiration_at_ms"]
                exp_date = datetime.fromtimestamp(int(exp_date))
            except Exception as e:
                print(f"Error retrieving expiry date: {e}")
            try:
                event_type =  data["type"]
                match event_type:
                    case "INITIAL_PURCHASE":
                        # initial purchase subscribe user
                        user.profile.subscription = exp_date 

                    case "RENEWAL":
                        user.profile.subscription = exp_date

                    case "CANCELLATION":
                        user.profile.subscription = exp_date
                    
                    case "UNCANCELLATION":
                        user.profile.subscription = exp_date

                    case "EXPIRATION":
                        user.profile.subscription = exp_date
                    case "SUBSCRIPTION_EXTENDED":
                        user.profile.subscription = exp_date
                    case _:
                        user.profile.subscription = exp_date
                        
                user.profile.save()
                return HttpResponse(200)    
                    
                
            except Exception as e:
                print(f"Error could hnot process event type: {e}")
                return HttpResponse(400)

        except Exception as e:
            print(f"Error in webhook: {e}")
            return HttpResponse(status=500)