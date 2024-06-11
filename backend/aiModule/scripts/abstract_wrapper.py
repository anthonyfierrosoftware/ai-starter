from abc import ABC, abstractmethod


class AbstractWrapper(ABC):

    @abstractmethod
    def set_conversation_history(self):
        """
        Sets the conversation history takes an array of dictionary objects
        """

    @abstractmethod
    def set_max_tokens(self):
        """
        sets the max token limit per request
        """

    @abstractmethod
    def set_system_instructions(self):
        """
        sets the system instructions for requests
        """

    @abstractmethod
    def set_chat_model(self):
        """
        sets the chat_model being used by the wrapper
        """

    @abstractmethod
    def get_chat_model(self):
        """
        gets the current chat model being used by the wrapper
        """

    @abstractmethod
    def authorize(self):
        """
        test to ensure the current configuration is authorized and valid
        """

    @abstractmethod
    def text_chat(self):
        """
        this function is responsible for accessing the llm api
        """

    @abstractmethod
    def send_text_chat(self):
        """
        this function is responsible for formatting data and responses to and from the llm
        essentially it fomrats data and calls text_chat

        returns:
            response, reply, config, chatHistory,tokens
        """
