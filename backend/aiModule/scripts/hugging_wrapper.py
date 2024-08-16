from langchain_community.llms import HuggingFaceEndpoint
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate, ChatPromptTemplate
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage


from .abstract_wrapper import AbstractWrapper

import os


class HuggingWrapper(AbstractWrapper):
    def __init__(self, api_key=None, chat_model=None, system_instructions=None):

        self.api_key = api_key if api_key else os.getenv("HUGGINGFACE_API_KEY", False)
        self.chat_model = chat_model if chat_model else "meta-llama/Llama-2-7b-chat-hf"

        self.client = HuggingFaceEndpoint(
            repo_id=self.chat_model, huggingfacehub_api_token=self.api_key
        )

        self.conversation_history = None
        self.max_tokens = 4096
        self.models = ["meta-llama/Llama-2-70b-chat-hf","meta-llama/Llama-2-7b-chat-hf"]
        self.msg_limit = 7

        self.system_instructions = (
            system_instructions
            if system_instructions
            else "You are a helpful assistant"
        )

    def set_conversation_history(self, ch=None):
        """
        ensure system message is in chat history
        """
        try:
            if not ch[0]["role"] == "system":
                ch.insert(0, {"role": "system", "content": self.system_instructions})
        except Exception as e:
            print(f"Error in huggin wrapper set_conversation_history: {e}")
        self.conversation_history = ch

    def set_chat_model(self, model="meta-llama/Llama-2-70b-chat-hf"):
        """
        Due to how the hugging face client works this also authorizes the configuration before setting the client
        """

        try:
            self.client = HuggingFaceEndpoint(
                repo_id=model, huggingfacehub_api_token=self.api_key
            )
            self.model = model
            return (None, True)

        except Exception as e:
            self.client = HuggingFaceEndpoint(
                repo_id=self.model, huggingfacehub_api_token=self.api_key
            )
            print(f"Error in hugging face wrapper assigning model: {e}")
            return (e, True)

    def get_chat_model(self, model_id=None):
        """
        gets the default chat model
        """
        return self.chat_model

    def set_max_tokens(self, max=4096):
        self.max_tokens = max

    def set_system_instructions(self, si="You are a helpful assistant"):
        self.system_instructions = si

    def authorize(self):
        """
        - Checks to insure the instance of hugging face is valid with model configuiration
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
                self.client = HuggingFaceEndpoint(
                    repo_id=self.chat_model, huggingfacehub_api_token=self.api_key
                )
                test = 1
            except Exception as e:
                print(e)

            # try reauthorizing
            if not test:
                try:
                    self.client = HuggingFaceEndpoint(
                        repo_id=self.chat_model, huggingfacehub_api_token=self.api_key
                    )
                    test = 2
                except Exception as e:
                    print(e)

            return test

        except Exception as e:
            print(e)
            print(
                "Apologies big dog, we cant connect right now, try checking your api key ;)"
            )
            return 0

    def text_chat(self, data={}, prompt=None, model_id=None, temp=0.8, top_p=0.95):
        """
        Used to access the text completions
        prompt the prompt generated in teh other function
        data : the data object to be used in the invoke call
        model_id : the id of the model you would like to use if not defaults to : gpt-3.5-turbo
        temp: the temperature for results affects randomness higher is more random default 1, must be between 0 and 1
        top_p: similar to temperature affects randomness higher is more random default 0-1

        """
        try:
            if model_id:
                res, succ = self.set_chat_model(model_id)

                if not succ:
                    return (res, False)

            # reinitialize the llm with config
            self.client = HuggingFaceEndpoint(
                repo_id=self.chat_model,
                huggingfacehub_api_token=self.api_key,
                temperature=temp,
                top_p=top_p,
                max_new_tokens=self.max_tokens,
            )

            hub_chain = LLMChain(prompt=prompt, llm=self.client)

            ret = hub_chain.invoke(input=data)

            return (ret, True)

        except Exception as e:
            print(f"Error retirieving text chat completion: {e}")
            # print(dir(e))
            return (e, False)

    def send_text_chat(
        self,
        message="",
        system_instructions=None,
        model_id=None,
        reset=False,
        temp=0.8,
        top_p=0.95,
    ):
        """
        This function takes a message and either starts a new conversation or appends to the current conversation
        then returns the response
        restart: a boolean that tells the system to restart the conversation
        message: the desired message from the user a string
        system_instructions: informs the chat how to act, takes in english responses, only relevent for new conversations
        model_id: a new model to switch the config

        returns:
        response, reply, chat_history,tokens
        """
        try:

            if system_instructions:
                self.system_instructions = system_instructions

            if not self.conversation_history or reset:
                self.conversation_history = [
                    {"role": "system", "content": self.system_instructions}
                ]
            self.conversation_history.append(
                {"role": "user", "content": f"{message}.\n"}
            )

            temp_arr = []
            ch = self.conversation_history[-self.msg_limit :]

            # check and add back system instructions in case it was removed with msg limit
            if not ch[0]["role"] == "system":
                ch.insert(0, {"role": "system", "content": self.system_instructions})

            for msg in ch:
                if msg["role"] == "user":
                    temp_arr.append(HumanMessage(content=msg["content"]))
                elif msg["role"] == "assistant":
                    temp_arr.append(AIMessage(content=msg["content"]))
                elif msg["role"] == "system":
                    temp_arr.append(SystemMessage(content=msg["content"]))

            prompt = ChatPromptTemplate.from_messages(temp_arr)
            response, success = self.text_chat(
                model_id=model_id, prompt=prompt, temp=temp, top_p=top_p
            )

            if not success:
                return (response, False)

            # append response onto the conversation history
            self.conversation_history.append(
                {"role": "assistant", "content": response["text"]}
            )

            reply = response["text"]

            # get tokens
            temp_arr.append(AIMessage(content=reply))
            tokens = self.client.get_num_tokens_from_messages(temp_arr)

            ret = {
                "response": response,
                "reply": reply,
                "chat_history": self.conversation_history,
                "tokens": int(tokens),
            }
            return (ret, True)
        except Exception as e:
            print(f"Error sending text_chat: {e}")
            return (e, False)


# custom callback handler implementations, left here for quick deployment
# from langchain_core.callbacks import StdOutCallbackHandler, BaseCallbackHandler
# from typing import Any, Dict, List, Union
# class HuggingHandler(BaseCallbackHandler):
#     def on_llm_start( self, serialized: Dict[str, Any], prompts: List[str], **kwargs: Any ) -> Any:
#         print(f"on_llm_start {serialized['name']}")

#     def on_llm_new_token(self, token: str, **kwargs: Any) -> Any:
#         print(f"on_new_token {token}")

#     def on_llm_error( self, error: Union[Exception, KeyboardInterrupt], **kwargs: Any ) -> Any:
#         """Run when LLM errors."""

#     def on_chain_start( self, serialized: Dict[str, Any], inputs: Dict[str, Any], **kwargs: Any ) -> Any:
#         print(f"on_chain_start {serialized}")

#     def on_chain_end(self, outputs: Dict[str, Any], **kwargs: Any) -> Any:
#         print(f"on_chain_end {outputs}")

#     def on_text(self, text: str, **kwargs: Any) -> Any:
#         """Run on arbitrary text."""
#         print(f"on_text {text}")

# def on_tool_start(self, serialized: Dict[str, Any], input_str: str, **kwargs: Any ) -> Any:
#     print(f"on_tool_start {serialized['name']}")

# def on_agent_action(self, action: AgentAction, **kwargs: Any) -> Any:
#     print(f"on_agent_action {action}")


# set up callback for token tracking
# handler = StdOutCallbackHandler()
# handler= HuggingHandler()
# data["callbacks"]=[handler]
