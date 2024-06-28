from django.apps import apps
from django.contrib.auth.models import User
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.core.mail import EmailMessage



from rest_framework.views import APIView
from utility.helpers.response import generate_response, error_list_object

import json
import uuid

import hashlib

class ForgotPassword(APIView):
    
    def post(self, request):
        '''
        creates a temp password emails it to the user then hashes it 
        When user logs in through custom log in it will check to see if the temp password is used
        if it is it will set that as the password otherise it will delete it 
        '''
        try:
            
            data = json.loads(request.body)
            try:
                
                user = User.objects.get(email__iexact = data["email"])
                
            except Exception as e:
                print("Forgot Password could not find user from email: {e}")
                error= [error_list_object("Email", "No user assosciated with the email provided.")]
                return generate_response(status=422, data=error, custom_message=None )
            
            # create random password 
            tempPass= str(uuid.uuid4())
            
            # email to user
            try:
                # you need to configur your email in the settings you can agg a google one fairly easily with an app password
                emailTempPassword(request, user, tempPass)
            except Exception as e:
                print(f"error sending email: {e}")
                return generate_response(status=500, data=str(e)+".", custom_message="Could not send email.")
                

            # hash and save temp password to profile 
            hash = hashlib.sha256()
            hash.update(tempPass.encode())
            
            hashed_pass=str(hash.hexdigest())
            
            user.profile.tempPassword = hashed_pass
            user.profile.save()
            
            return generate_response(status=200, data=None, custom_message="temporary password has been emailed.")
            
        except Exception as e:
            print(f"error registering new user:{e}")
                
            return generate_response(status=500, data=str(e)+".", custom_message="Server error processing forgot password.")


def emailTempPassword(request, user, temp_pasword):
    '''
    Generates and sends email with temp password to user
    '''

    current_site = get_current_site(request)
    user = user
    email = user.email
    subject = "Reset Password"
    message = render_to_string('emails/forgot_password.html', {
        'request': request,
        'user': user,
        'temp_password':temp_pasword,
        'domain': current_site.domain,

    })
    email = EmailMessage(
        subject, message, to=[email]
    )
    email.content_subtype = 'html'
    email.send()
       
    return True    