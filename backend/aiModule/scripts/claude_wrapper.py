import os
import anthropic
from .abstract_wrapper import AbstractWrapper


class ClaudeWrapper(AbstractWrapper):
    def __init__(self, api_key=None, chat_model=None, system_instructions=None):

        self.api_key = api_key if api_key else os.getenv("CLAUDE_API_KEY", False)
        self.client = anthropic.Anthropic(api_key=self.api_key)
        self.conversation_history = None

        self.max_tokens = 4096
        self.msg_limit = 20
        self.chat_model = chat_model if chat_model else "claude-3-haiku-20240307"

        self.models = ["claude-3-opus-20240229","claude-3-5-sonnet-20240620", "claude-3-sonnet-20240229","claude-3-haiku-20240307"]

        self.system_instructions = (
            system_instructions
            if system_instructions
            else "You are a helpful assistant"
        )

    def set_conversation_history(self, ch: list = None):
        try:
            if ch[0]["role"] == "system":
                ch.pop(0)
        except Exception as e:
            print(
                f"Error checking system config in claude wrapper set_conversation_history: {e}"
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
        - Checks to insure the instance of Claude is valid
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
                self.client = anthropic.Anthropic(api_key=self.api_key)
                test = 1
            except Exception as e:
                print(e)

            # try reauthorizing
            if not test:
                try:
                    self.client = anthropic.Anthropic(api_key=self.api_key)
                    test = 2
                except Exception as e:
                    print(e)

            return test

        except Exception as e:
            print(e)
            print("Authorization failed, try checking your api_key")
            return 0

    def text_chat(self, messages=[], model_id=None, temp=1, top_p=1):
        """
        Used to access the text completions
        messages : an array of the messages to generate a response to
        model_id : the id of the model you would like to use if not defaults to : gpt-3.5-turbo
        temp: the temperature for results affects randomness higher is more random default 1, must be between 0 and 1
        top_p: similar to temperature affects randomness higher is more random default 0-1
        """
        try:
            if model_id:
                self.set_chat_model(model_id)

            ret = self.client.messages.create(
                model=self.chat_model,
                messages=messages,
                max_tokens=self.max_tokens,
                temperature=temp,
                top_p=top_p,
                system=self.system_instructions,
            )

            return (ret, True)

        except Exception as e:
            print(f"Error retirieving text chat completion: {e}")
            try:
                e = str(e.body["error"]["message"])
            except:
                e = str(e)
            return (e, False)

    def send_text_chat(
        self,
        message="",
        system_instructions=None,
        model_id=None,
        reset=False,
        temp=1,
        top_p=1,
    ):
        """
        This function takes a message and either starts a new conversation or appends to the current conversation
        then returns the response
        reset: a boolean that tells the system to restart the conversation
        message: the desired message from the user a string
        system_instructions: informs the chat how to act, takes in english responses, only relevent for new conversations
        model_id: the model id to set, if none it uses the current model or defualt model

        returns:
        response, reply, chat_history,tokens
        """
        try:

            if system_instructions:
                self.system_instructions = system_instructions

            if not self.conversation_history or reset:
                self.conversation_history = []

            # append the message the conversation history
            self.conversation_history.append({"role": "user", "content": message})

            messages = self.conversation_history[-self.msg_limit :]
            # to deal with system message errors, the first msessage must be from the user
            try:
                test=True
                while(test):
                    if messages[0]["role"] == "assistant":
                        messages.pop(0)
                    else:
                        test = False
            except Exception as e:
                print(
                    f"Error updating messages objecty: {e}"
                )
                
            response, success = self.text_chat(
                messages=messages,
                model_id=model_id,
                temp=temp,
                top_p=top_p,
            )

            if not success:
                return (response, False)

            self.conversation_history.append(
                {"role": "assistant", "content": response.content[0].text}
            )

            total_tokens = response.usage.input_tokens + response.usage.output_tokens
            ret = {
                "response": response,
                "reply": response.content[0].text,
                "chat_history": self.conversation_history,
                "tokens": total_tokens,
            }
            return (ret, True)
        except Exception as e:
            print(f"Error sending text_chat: {e}")
            return (e, False)
