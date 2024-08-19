import os
from openai import OpenAI
from .abstract_wrapper import AbstractWrapper
from .openapi_utils import *


class OpenAIWrapper(AbstractWrapper):
    def __init__(self, api_key=None, chat_model=None, system_instructions=None):

        self.api_key = api_key if api_key else os.getenv("OPENAI_API_KEY", False)
        self.max_tokens = 2048
        self.msg_limit = 20

        self.system_instructions = (
            system_instructions
            if system_instructions
            else "You are a helpful assistant"
        )

        self.client = OpenAI(api_key=self.api_key)
        self.conversation_history = None

        self.chat_model = chat_model if chat_model else "gpt-4o-mini"
        try:
            self.models = self.client.models.list().data
        except:
            # default models we support
            self.models = ["gpt-3.5-turbo", "gpt-4-turbo","gpt-4o","gpt-4o-mini"]

    def set_conversation_history(self, ch=None):
        try:
            if not ch[0]["role"] == "system":
                ch.insert(0, {"role": "system", "content": self.system_instructions})
        except Exception as e:
            print(
                f"Error checking system config in openaiwrapper set_conversation_history: {e}"
            )
        self.conversation_history = ch

    def set_max_tokens(self, max=2048):
        self.max_tokens = max

    def set_system_instructions(self, si="You are a helpful assistant"):
        self.system_instructions = si

    def set_chat_model(self, model_id=None):
        """
        sets the default chat model
        """
        if not model_id:
            return False

        self.chat_model = model_id
        return model_id

    def get_chat_model(self, model_id=None):
        """
        gets the default chat model
        """
        return self.chat_model

    def authorize(self):
        """
        - Checks to insure the instance of openAI is valid
        - if not valid attempts to reauthenticate
        - also retrieves latest available models

        returns 0,1,2
        0: Fail not authorized
        1: Initial pass authorized
        2: Initial Fail but sequential pass

        """
        # check if valid with test call
        try:
            test = 0
            try:
                self.client.models.list()
                test = 1
            except Exception as e:
                print(e)

            # try reauthorizing
            if not test:
                self.client.api_key = self.api_key

                try:
                    self.client.models.list()
                    test = 2
                except Exception as e:
                    print(e)

            if test and not self.models:
                self.models = self.client.models.list().data

            return test

        except Exception as e:
            print(e)
            print(
                "Apologies big dog, we cant connect right now, try checking your env file ;)"
            )
            return 0

    def retrieve_model_info(self, id):
        """
        exclusive to openAI **
        retrieves model information from an ID
        returns either the model info or False
        """
        try:
            ret = self.client.models.retrieve(id)
            return ret

        except Exception as e:
            print(f"Error retirieving model info for: {id}, Error: {e}")
            return False

    def text_chat(self, messages=[], model_id=None, results_num=1, temp=1, top_p=1):
        """
        Used to access the text completions

        for open ai version we use tiktoken to predict and enforce token restrictions

        messages : an array of the messages to generate a response to
        model_id : the id of the model you would like to use if not defaults to : gpt-3.5-turbo
        result_num: the number of results you would like returned defaults to 1
        temp: the temperature for results affects randomness higher is more random default 1, must be between 0 and 2
        top_p: similar to temperature affects randomness higher is more random default 1

        """
        try:

            if model_id:
                self.set_chat_model(model_id)

            # check and add back system instructions in case it was removed with msg limit
            if not messages[0]["role"] == "system":
                messages.insert(
                    0, {"role": "system", "content": self.system_instructions}
                )

            # Calc token usage
            max_tokens = num_tokens_from_messages(messages, self.chat_model)

            if max_tokens > self.max_tokens:
                print(
                    f"warning this request has surpassed the maximum tokens: {max_tokens}, limited to: {self.max_tokens} results may be cut short, you may want to reset the chat"
                )

            ret = self.client.chat.completions.create(
                model=self.chat_model,
                messages=messages,
                max_tokens=self.max_tokens,
                n=results_num,
                temperature=temp,
                top_p=top_p,
            )

            return (ret, True)

        except Exception as e:
            print(f"Error retirieving text chat completion: {e}")
            # print(dir(e))
            try:
                e = e.body["message"]
            except:
                e = str(e)

            return (e, False)

    def send_text_chat(
        self,
        message="",
        system_instructions="You are a helpful assistant",
        model_id=None,
        reset=False,
        results_num=1,
        temp=1,
        top_p=1,
    ):
        """
        This function takes a message and either starts a new conversation or appends to the current conversation
        then returns the response
        restart: a boolean that tells the system to restart the conversation
        message: the desired message from the user a string
        system_instructions: informs the chat how to act, takes in english responses, only relevent for new conversations
        model_id: the model id to set, if none it uses the current model or defualt model

        returns:
        response, reply, config, chat_history,tokens
        """
        try:

            if system_instructions:
                self.system_instructions = system_instructions

            if not self.conversation_history or reset:
                self.conversation_history = [
                    {"role": "system", "content": self.system_instructions}
                ]

            # append the message the conversation history
            self.conversation_history.append({"role": "user", "content": message})
            
            # check for system instruction rebind into place
            ch = self.conversation_history[-self.msg_limit :]
            if not ch[0]["role"] == "system":
                ch.insert(0, {"role": "system", "content": self.system_instructions})

            response, success = self.text_chat(
                messages=ch,
                model_id=model_id,
                results_num=results_num,
                temp=temp,
                top_p=top_p,
            )

            if not success:
                return (response, False)

            # response = ret.choices[0].message.content
            self.conversation_history.append(
                {"role": "assistant", "content": response.choices[0].message.content}
            )

            ret = {
                "response": response,
                "reply": response.choices[0].message.content,
                # "config" : None,
                "chat_history": self.conversation_history,
                "tokens": response.usage.total_tokens,
            }

            return (ret, True)
        except Exception as e:
            print(f"Error sending text_chat: {e}")
            return (e, False)
