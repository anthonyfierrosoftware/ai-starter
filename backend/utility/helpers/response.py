from rest_framework import status
from rest_framework.response import Response

# formats error response 
def error_list_object(field, message):
    return {
        "errorTitle": field,
        "errorMessage": message
    }

def success_200_json(data, custom_message):
    response = {
        "status": 200,
        "data": data,
        "message": custom_message
    }
    return (response, status.HTTP_200_OK)

def success_201_json(data, custom_message):
    response = {
        "status": 201,
        "data": data,
        "message": custom_message
    } 
    return (response, status.HTTP_201_CREATED)

def success_202_json(data, custom_message):
    response = {
        "status": 202,
        "data": data,
        "message": custom_message
    } 
    return (response, status.HTTP_202_ACCEPTED)

def success_204_json(data= None, custom_message=None):
    response = {
        "status": 204,
        "data":data,
        "message": custom_message if custom_message else "Request successful, no content to return."
    }
    return (response, status.HTTP_204_NO_CONTENT)

def error_400_json(data, custom_message):
    response = {
        "status": 400,
        "message": custom_message,
        "data": {
            "error":{
                "errorTitle": "Bad Request.",
                "errorMessage": data if data else "Client request is invalid and cannot be processed."
            }

        }
    }
    return (response, status.HTTP_400_BAD_REQUEST)

def error_401_json(data, custom_message):
    response = {
        "status": 401,
        "message": custom_message,
        "data": {
            "error":{
                "errorTitle": "Unauthorized.",
                "errorMessage": data if data else "The request lacks valid authentication credentials for the requested resource."
            }

        }
        
    }
    return (response, status.HTTP_401_UNAUTHORIZED)

def error_403_json(data, custom_message):
    response = {
        "status": 403,
        "message": custom_message,
        "data": {
            "error":{
                "errorTitle": "Access forbidden.",
                "errorMessage": data if data else "You do not have access to this resource."
            }
            
        }
    }
    return (response, status.HTTP_403_FORBIDDEN)

def error_404_json(data, custom_message, field):
    response = {
        "status": 404,
        "message": custom_message,
        "data": {
            "error":{
                "errorTitle": f"{field} not found" if field else "Resource Not Found",
                "errorMessage": data if data else "The requested resource does not exist. Please ensure you entered the correct URL."
            }

        }
    }
    return (response, status.HTTP_404_NOT_FOUND)

def error_406_json(data,custom_message=None):
    '''
    Pass an array of errorList objects as defined in the fuinction above
    '''
    response = {
        "status": 406,
        "data": {
            "errors":data
            },
        "message": custom_message
        }
    return (response, status.HTTP_406_NOT_ACCEPTABLE)

def error_412_json(data,custom_message=None):
    '''
    Pass an array of errorList objects as defined in the fuinction above
    '''
    response = {
        "status": 412,
        "data": {
            "errors":data
            },
        "message": custom_message
        }
    return (response, status.HTTP_412_PRECONDITION_FAILED)

def error_422_json(data,custom_message=None):
    '''
    Pass an array of errorList objects as defined in the fuinction above
    '''
    response = {
        "status": 422,
        "data": {
            "errors":data
            },
        "message": custom_message
        }
    return (response, status.HTTP_422_UNPROCESSABLE_ENTITY)

def error_460_json(data,custom_message=None):
    '''
    Pass an array of errorList objects as defined in the fuinction above
    '''
    response = {
        "status": 460,
        "data": {
            "errors":f"Expired Subscription {data}."
            },
        "message": custom_message
        }
    return (response, 460)

def error_500_json(data, custom_message):
    response = {
        "status": 500,
        "message": custom_message,
        "data": {
            "error":{
                "errorTitle": "Internal Server Error",
                "errorMessage": data if data else "Oops! Something went wrong. Please contact support"                
            }

                }
            }
    return (response, status.HTTP_500_INTERNAL_SERVER_ERROR)




def generate_response(status, data, custom_message=None, field = False):

    """
	Generate Response object with the proper messages according to Postman convention. If an invalid code
    or data are given, throw a ValueError
    status: the status code
    data: the data or errors to be passed to the response
    custom_message: the message to be sent along with the response
    field: used in 404 to denote a specific field
    """ 
    try:
        if status == 200:
            res, gen_status = success_200_json(data, custom_message)
            return Response(res, status=gen_status)
        
        elif status == 201:
            res, gen_status = success_201_json(data, custom_message)
            return Response(res, status=gen_status)
        
        elif status == 202:
            res, gen_status = success_202_json(data, custom_message)
            return Response(res, status=gen_status)
        
        elif status == 204:
            res, gen_status = success_204_json(data, custom_message)
            return Response(res, status=gen_status)
        
        elif status == 400:
            res, gen_status = error_400_json(data, custom_message)
            return Response(res, status=gen_status)
        
        elif status == 401:
            res, gen_status = error_401_json(data, custom_message)
            return Response(res, status=gen_status)
        
        elif status == 403:
            res, gen_status = error_403_json(data, custom_message)
            return Response(res, status=gen_status)
        
        elif status == 404:
            res, gen_status = error_404_json(data, custom_message, field)
            return Response(res, status=gen_status)
        
        elif status == 406:
            res, gen_status = error_406_json(data,  custom_message)
            return Response(res, status=gen_status)
        
        elif status == 412:
            res, gen_status = error_412_json(data,  custom_message)
            return Response(res, status=gen_status)
        
        elif status == 422:
            res, gen_status = error_422_json(data,  custom_message)
            return Response(res, status=gen_status)
        
        elif status == 460:
            res, gen_status = error_460_json(data,  custom_message)
            return Response(res, status=gen_status)
        
        elif status == 500:
            res, gen_status = error_500_json(data, custom_message)
            return Response(res, status=gen_status)
    except:
        raise ValueError('If you are throwing an error, make sure you provide and error_field parameter, if you are returning a success please provide the data.')
     