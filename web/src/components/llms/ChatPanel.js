import { useEffect, useState } from "react";

import { BodyText, Subheading } from "../global/Text";
import { FlexColumn, FlexRow } from "../layout/Flex";
import RadioCheckbox from "../global/RadioInput";
import TextArea from "../global/TextArea";

import { models, getModelConfig } from "../../state/modelsConfig";
import Button from "../global/Button";
import { sendChat } from "../../state/routes";
import { useAuthStore } from "../../state/stores";

const ChatPanel = ({ chatToLoad, chatMode }) => {
  const [isMultiPrompt, setIsMultiPrompt] = useState("Single input");
  const [messageValue, setMessageValue] = useState();
  const [systemInstructions, setSystemInstructions] = useState("");

  const [gpt35Chat, setGpt35Chat] = useState([]);
  const [gpt4Chat, setGpt4Chat] = useState([]);
  const [claudeChat, setClaudeChat] = useState([]);
  const [llamaChat, setLlamaChat] = useState([]);
  const [mistralChat, setMistralChat] = useState([]);

  const [gpt35ChatId, setGpt35ChatId] = useState(false);
  const [gpt4ChatId, setGpt4ChatId] = useState(false);
  const [claudeChatId, setClaudeChatId] = useState(false);
  const [llamaChatId, setLlamaChatId] = useState(false);
  const [mistralChatId, setMistralChatId] = useState(false);

  const [gpt35ChatLoading, setGpt35ChatLoading] = useState(false);
  const [gpt4ChatLoading, setGpt4ChatLoading] = useState(false);
  const [claudeChatLoading, setClaudeChatLoading] = useState(false);
  const [llamaChatLoading, setLlamaChatLoading] = useState(false);
  const [mistralChatLoading, setMistralChatLoading] = useState(false);

  const [gpt35ChatError, setGpt35ChatError] = useState("");
  const [gpt4ChatError, setGpt4ChatError] = useState("");
  const [claudeChatError, setClaudeChatError] = useState("");
  const [llamaChatError, setLlamaChatError] = useState("");
  const [mistralChatError, setMistralChatError] = useState("");

  const [buttonIsLoading, setButtonIsLoading] = useState(false);

  const getChatByModelId = (id) => {
    if (id == "GPT3.5") return gpt35Chat;
    else if (id == "GPT4.0") return gpt4Chat;
    else if (id == "Claude") return claudeChat;
    else if (id == "Llama") return llamaChat;
    else if (id == "Mistral") return mistralChat;
  };

  const getChatLoadStateByModelId = (id) => {
    if (id == "GPT3.5") return gpt35ChatLoading;
    else if (id == "GPT4.0") return gpt4ChatLoading;
    else if (id == "Claude") return claudeChatLoading;
    else if (id == "Llama") return llamaChatLoading;
    else if (id == "Mistral") return mistralChatLoading;
  };

  const getChatIdByModelId = (id) => {
    if (id == "GPT3.5" || id == "gpt-3.5-turbo") return gpt35ChatId;
    else if (id == "GPT4.0" || id == "gpt-4-turbo") return gpt4ChatId;
    else if (id == "Claude" || id == "claude-3-opus-20240229")
      return claudeChatId;
    else if (id == "Llama" || id == "xxx") return llamaChatId;
    else if (id == "Mistral" || id == "mistral-large-latest")
      return mistralChatId;
  };

  const setChatByModelId = (id, newChat) => {
    const newData = [...newChat];
    if (id == "GPT3.5" || id == "gpt-3.5-turbo") setGpt35Chat([...newData]);
    else if (id == "GPT4.0" || id == "gpt-4-turbo") setGpt4Chat([...newData]);
    else if (id == "Claude" || id == "claude-3-opus-20240229")
      setClaudeChat([...newData]);
    else if (id == "Llama" || id == "xxx") setLlamaChat([...newData]);
    else if (id == "Mistral" || id == "mistral-large-latest")
      setMistralChat([...newData]);
  };

  const setChatIdByModelId = (modelId, chatId) => {
    if (modelId == "GPT3.5" || modelId == "gpt-3.5-turbo")
      setGpt35ChatId(chatId);
    else if (modelId == "GPT4.0" || modelId == "gpt-4-turbo")
      setGpt4ChatId(chatId);
    else if (modelId == "Claude" || modelId == "claude-3-opus-20240229")
      setClaudeChatId(chatId);
    else if (modelId == "Llama" || modelId == "xxx") setLlamaChatId(chatId);
    else if (modelId == "Mistral" || modelId == "mistral-large-latest")
      setMistralChatId(chatId);
  };

  useEffect(() => {
    // console.log(
    //   "chat to load useeffect",
    //   chatToLoad,
    //   chatToLoad.llmConfig?.chat_model
    //   chatToLoad.pk
    // );
    if (chatToLoad) {
      setChatByModelId(
        chatToLoad.llmConfig?.chat_model,
        chatToLoad.chatHistory
      );
      setChatIdByModelId(chatToLoad.llmConfig?.chat_model, chatToLoad.pk);
    }
  }, [chatToLoad]);

  const authState = useAuthStore((state) => state.auth);
  const apiHeaders = { Authorization: `Token ${authState.token}` };

  const sendPrompt = (
    id,
    value,
    onSuccess = () => {},
    onError = () => {},
    conversationId = false
  ) => {
    sendChat(
      {
        ...(conversationId && {
          conversation: conversationId,
        }),
        prompt: value,
        config: {
          ...getModelConfig(id),
          systemInstructions: systemInstructions,
        },
      },
      (res) => {
        // console.log("sendmsg success", res);
        onSuccess(res);
      },
      (err) => {
        console.log("send message err", err);
        onError(err);
      },
      { ...apiHeaders }
    );
  };

  const sendMultiplePrompt = () => {
    setGpt35ChatLoading(true);
    setGpt4ChatLoading(true);
    setClaudeChatLoading(true);
    setLlamaChatLoading(true);
    setMistralChatLoading(true);
    sendPrompt(
      "GPT3.5",
      messageValue,
      (res) => {
        setChatByModelId("GPT3.5", [
          ...res?.data.data.conversation.chatHistory,
        ]);
        if (chatMode == "Conversation Mode") {
          setGpt35ChatId(res?.data.data.conversation.pk);
        }
        setGpt35ChatLoading(false);
      },
      (err) => {
        setGpt35ChatError(err?.data?.errors);
        setGpt35ChatLoading(false);
      },
      chatMode == "Conversation Mode" ? gpt35ChatId : false
    );
    sendPrompt(
      "GPT4.0",
      messageValue,
      (res) => {
        setChatByModelId("GPT4.0", [
          ...res?.data.data.conversation.chatHistory,
        ]);
        if (chatMode == "Conversation Mode") {
          setGpt4ChatId(res?.data.data.conversation.pk);
        }
        setGpt4ChatLoading(false);
      },
      (err) => {
        setGpt4ChatError(err?.data?.errors);
        setGpt4ChatLoading(false);
      },
      chatMode == "Conversation Mode" ? gpt4ChatId : false
    );
    sendPrompt(
      "Claude",
      messageValue,
      (res) => {
        setChatByModelId("Claude", [
          ...res?.data.data.conversation.chatHistory,
        ]);
        if (chatMode == "Conversation Mode") {
          setClaudeChatId(res?.data.data.conversation.pk);
        }
        setClaudeChatLoading(false);
      },
      (err) => {
        setClaudeChatError(err?.data?.errors);
        setClaudeChatLoading(false);
      },
      chatMode == "Conversation Mode" ? claudeChatId : false
    );
    sendPrompt(
      "Llama",
      messageValue,
      (res) => {
        setChatByModelId("Llama", [...res?.data.data.conversation.chatHistory]);
        if (chatMode == "Conversation Mode") {
          setLlamaChatId(res?.data.data.conversation.pk);
        }
        setLlamaChatLoading(false);
      },
      (err) => {
        setLlamaChatError(err?.data?.errors);
        setLlamaChatLoading(false);
      }
    );
    sendPrompt(
      "Mistral",
      messageValue,
      (res) => {
        setChatByModelId("Mistral", [
          ...res?.data.data.conversation.chatHistory,
        ]);
        if (chatMode == "Conversation Mode") {
          setMistralChatId(res?.data.data.conversation.pk);
        }
        setMistralChatLoading(false);
      },
      (err) => {
        setMistralChatError(err?.data?.errors);
        setMistralChatLoading(false);
      },
      chatMode == "Conversation Mode" ? mistralChatId : false
    );
  };

  const sendMultipleInput = (modelId, messageValue) => {
    if (modelId == "GPT3.5") {
      setGpt35ChatLoading(true);
      sendPrompt(
        "GPT3.5",
        messageValue,
        (res) => {
          setChatByModelId("GPT3.5", [
            ...res?.data.data.conversation.chatHistory,
          ]);
          if (chatMode == "Conversation Mode") {
            setGpt35ChatId(res?.data.data.conversation.pk);
          }
          setGpt35ChatLoading(false);
        },
        (err) => {
          setGpt35ChatError(err?.data?.errors);
          setGpt35ChatLoading(false);
        },
        chatMode == "Conversation Mode" ? gpt35ChatId : false
      );
    } else if (modelId == "GPT4.0") {
      setGpt4ChatLoading(true);
      sendPrompt(
        "GPT4.0",
        messageValue,
        (res) => {
          setChatByModelId("GPT4.0", [
            ...res?.data.data.conversation.chatHistory,
          ]);
          if (chatMode == "Conversation Mode") {
            setGpt4ChatId(res?.data.data.conversation.pk);
          }
          setGpt4ChatLoading(false);
        },
        (err) => {
          setGpt4ChatError(err?.data?.errors);
          setGpt4ChatLoading(false);
        },
        chatMode == "Conversation Mode" ? gpt4ChatId : false
      );
    } else if (modelId == "Claude") {
      setClaudeChatLoading(true);
      sendPrompt(
        "Claude",
        messageValue,
        (res) => {
          setChatByModelId("Claude", [
            ...res?.data.data.conversation.chatHistory,
          ]);
          if (chatMode == "Conversation Mode") {
            setClaudeChatId(res?.data.data.conversation.pk);
          }
          setClaudeChatLoading(false);
        },
        (err) => {
          setClaudeChatError(err?.data?.errors);
          setClaudeChatLoading(false);
        },
        chatMode == "Conversation Mode" ? claudeChatId : false
      );
    } else if (modelId == "Llama") {
      setLlamaChatLoading(true);
      sendPrompt(
        "Llama",
        messageValue,
        (res) => {
          setChatByModelId("Llama", [
            ...res?.data.data.conversation.chatHistory,
          ]);
          if (chatMode == "Conversation Mode") {
            setLlamaChatId(res?.data.data.conversation.pk);
          }
          setLlamaChatLoading(false);
        },
        (err) => {
          setLlamaChatError(err?.data?.errors);
          setLlamaChatLoading(false);
        }
      );
    } else if (modelId == "Mistal") {
      setMistralChatLoading(true);
      sendPrompt(
        "Mistral",
        messageValue,
        (res) => {
          setChatByModelId("Mistral", [
            ...res?.data.data.conversation.chatHistory,
          ]);
          if (chatMode == "Conversation Mode") {
            setMistralChatId(res?.data.data.conversation.pk);
          }
          setMistralChatLoading(false);
        },
        (err) => {
          setMistralChatError(err?.data?.errors);
          setMistralChatLoading(false);
        },
        chatMode == "Conversation Mode" ? mistralChatId : false
      );
    }
  };

  return (
    <FlexColumn>
      <Subheading>Chat Panel</Subheading>
      <FlexRow>
        <FlexColumn>
          <BodyText style={{ fontSize: 14 }}>
            Share inputs between chats
          </BodyText>
          <RadioCheckbox
            options={["Single input", "Multi-input"]}
            onChange={(data) => setIsMultiPrompt(data)}
            defaultValue={"Single input"}
          />
        </FlexColumn>
        <FlexRow>
          <TextArea
            label="Set instructions for the LLMs in the prompt configuration"
            value={systemInstructions}
            onChange={setSystemInstructions}
          />
        </FlexRow>
      </FlexRow>
      <FlexRow></FlexRow>
      <FlexRow>
        {models.map((chat, i) => (
          <Chat
            chat={chat}
            conversationMode={chatMode == "Conversation Mode"}
            conversation={getChatByModelId(chat.name)}
            sendMultipleInput={sendMultipleInput}
            isLoading={getChatLoadStateByModelId(chat.name)}
            conversationId={
              chatMode == "Conversation Mode"
                ? getChatIdByModelId(chat.name)
                : false
            }
            key={i}
            isMultiPrompt={isMultiPrompt}
            sendPrompt={sendPrompt}
          />
        ))}
      </FlexRow>
      {isMultiPrompt == "Single input" && (
        <FlexColumn>
          <TextArea
            label="Send a message"
            value={messageValue}
            onChange={setMessageValue}
          />
          <Button
            text={buttonIsLoading ? "Sending..." : "Send"}
            onClick={() => {
              sendMultiplePrompt();
            }}
            style={{ width: "100%" }}
          />
        </FlexColumn>
      )}
    </FlexColumn>
  );
};

const Chat = ({
  chat,
  isMultiPrompt,
  conversationMode,
  sendPrompt,
  isLoading,
  conversation = false,
  conversationId = false,
  sendMultipleInput,
}) => {
  const [messageValue, setMessageValue] = useState();

  const [buttonIsLoading, setButtonIsLoading] = useState(false);

  return (
    <FlexColumn style={{ flex: 1 }}>
      <BodyText>
        <b>
          {chat?.name}
          {conversationId && `: Chat ${conversationId}`}
        </b>{" "}
        {isLoading && " Loading"}
      </BodyText>
      <FlexColumn>
        <ChatMessages conversation={conversation} />
      </FlexColumn>
      {isMultiPrompt == "Multi-input" && (
        <FlexColumn>
          <TextArea
            isTextArea={true}
            label="Send a message"
            value={messageValue}
            onChange={setMessageValue}
          />
          <Button
            text={buttonIsLoading ? "Sending..." : "Send"}
            onClick={() => {
              // setButtonIsLoading(true);
              sendMultipleInput(chat.name, messageValue);
              setMessageValue("");
            }}
            style={{ width: "100%" }}
          />
        </FlexColumn>
      )}
    </FlexColumn>
  );
};

const ChatMessages = ({ conversation }) => {
  return (
    <FlexColumn
      style={{
        maxHeight: "200px",
        overflowX: "scroll",
        border: "1px solid black",
        padding: "4px",
        borderRadius: "4px",
      }}
    >
      {conversation.map((message, i) => (
        <ChatMessage key={i} message={message} />
      ))}
    </FlexColumn>
  );
};

const ChatMessage = ({ message }) => {
  return (
    <div>
      <BodyText style={{ fontWeight: message.role != "user" && 800 }}>
        {message.content}
      </BodyText>
    </div>
  );
};

export default ChatPanel;
