from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
from .abstract_wrapper import AbstractWrapper

import os


class MistralWrapper(AbstractWrapper):
    def __init__(self, api_key=None, chat_model=None, system_instructions=None):

        self.api_key = api_key if api_key else os.getenv("MISTRAL_API_KEY", False)
        self.client = MistralClient(api_key=self.api_key)
        self.conversation_history = None

        self.max_tokens = 4096
        self.msg_limit = 20
        self.chat_model = chat_model if chat_model else "mistral-large-latest"

        try:
            self.models = self.client.list_models().data
        except:
            self.models = ["gpt-4-turbo", "gpt-3.5-turbo"]

        self.system_instructions = (
            system_instructions
            if system_instructions
            else "You are a helpful assistant"
        )

    def set_conversation_history(self, ch=None):
        try:
            if not ch[0]["role"] == "system":
                ch.insert(0, {"role": "system", "content": self.system_instructions})
        except Exception as e:
            print(
                f"Error checking system config in mistralwrapper set_conversation_history: {e}"
            )
        self.conversation_history = ch

    def set_max_tokens(self, max=4096):
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
                self.client.list_models()
                test = 1
            except Exception as e:
                print(e)

            # try reauthorizing
            if not test:
                self.client.api_key = self.api_key

                try:
                    self.client.list_models()
                    test = 2
                except Exception as e:
                    print(e)

            if test and not self.models:
                self.models = self.client.list_models().data

            return test

        except Exception as e:
            print(e)
            print("Authorization failed please check your api_key.")
            return 0

    def text_chat(self, messages=[], model_id=None, temp=0.7, top_p=1):
        """
        Used to access the text completions
        messages : an array of the messages to generate a response to
        model_id : the id of the model you would like to use if not defaults to : gpt-3.5-turbo
        temp: the temperature for results affects randomness higher is more random default 1, must be between 0 and 1
        top_p: similar to temperature affects randomness higher is more random default 0-1

        Todo integrate user, add tools

        """
        try:
            if model_id:
                self.set_chat_model(model_id)

            # check and add back system instructions in case it was removed with msg limit
            if not messages[0]["role"] == "system":
                messages.insert(
                    0, {"role": "system", "content": self.system_instructions}
                )

            ret = self.client.chat(
                model=self.chat_model,
                messages=messages,
                max_tokens=self.max_tokens,
                temperature=temp,
                top_p=top_p,
            )

            return (ret, True)

        except Exception as e:
            print(f"Error retirieving text chat completion: {e}")
            return (e, False)

    def send_text_chat(
        self,
        message="",
        system_instructions=None,
        model_id=None,
        reset=False,
        temp=0.7,
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
        response, reply,  chatHistory,tokens
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

            response, success = self.text_chat(
                messages=self.conversation_history[-self.msg_limit :],
                model_id=model_id,
                temp=temp,
                top_p=top_p,
            )

            if not success:
                return (response, False)

            self.conversation_history.append(
                {"role": "assistant", "content": response.choices[0].message.content}
            )

            total_tokens = response.usage.total_tokens
            ret = {
                "response": response,
                "reply": response.choices[0].message.content,
                "chatHistory": self.conversation_history,
                "tokens": total_tokens,
            }
            return (ret, True)
        except Exception as e:
            print(f"Error sending text_chat: {e}")
            return (e, False)
