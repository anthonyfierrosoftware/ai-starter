import { useEffect, useState } from "react";

import { BodyText } from "../global/Text";
import { FlexColumn, FlexRow } from "../layout/Flex";
import RadioCheckbox from "../global/RadioInput";
import TextArea from "../global/TextArea";
import Button from "../global/Button";
import ContentBlock from "../layout/ContentBlock";

import { models, getModelConfig } from "../../state/modelsConfig";
import { sendChat } from "../../state/routes";
import { useAuthStore, useThemeStore } from "../../state/stores";

const ChatPanel = ({
  chatToLoad,
  conversationMode,
  fetchConversations = () => {},
}) => {
  const { theme } = useThemeStore();

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

  const setChatByModelId = (id, newChat) => {
    const newData = [...newChat];
    if (id === "GPT3.5" || id === models[0].config.chat_model)
      setGpt35Chat([...newData]);
    else if (id === "GPT4.0" || id === models[1].config.chat_model)
      setGpt4Chat([...newData]);
    else if (id === "Claude" || id === models[2].config.chat_model)
      setClaudeChat([...newData]);
    else if (id === "Llama" || id === models[3].config.chat_model)
      setLlamaChat([...newData]);
    else if (id === "Mistral" || id === models[4].config.chat_model)
      setMistralChat([...newData]);
  };

  const setChatIdByModelId = (modelId, chatId) => {
    if (modelId === "GPT3.5" || modelId === models[0].config.chat_model) {
      setGpt35ChatId(chatId);
    } else if (
      modelId === "GPT4.0" ||
      modelId === models[1].config.chat_model
    ) {
      setGpt4ChatId(chatId);
    } else if (
      modelId === "Claude" ||
      modelId === models[2].config.chat_model
    ) {
      setClaudeChatId(chatId);
    } else if (modelId === "Llama" || modelId === models[3].config.chat_model) {
      setLlamaChatId(chatId);
    } else if (
      modelId === "Mistral" ||
      modelId === models[4].config.chat_model
    ) {
      setMistralChatId(chatId);
    }
  };

  useEffect(() => {
    if (chatToLoad) {
      setChatByModelId(
        chatToLoad.llm_config?.chat_model,
        chatToLoad.chat_history
      );
      setChatIdByModelId(chatToLoad.llm_config?.chat_model, chatToLoad.pk);
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
          system_instructions: systemInstructions,
        },
      },
      (res) => {
        onSuccess(res);
        fetchConversations();
      },
      (err) => {
        console.log("send message error", err);
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
          ...res?.data.data.conversation.chat_history,
        ]);
        if (conversationMode === "On") {
          setGpt35ChatId(res?.data.data.conversation.pk);
        }
        setGpt35ChatLoading(false);
      },
      (err) => {
        setGpt35ChatError(err?.data?.errors);
        setGpt35ChatLoading(false);
      },
      conversationMode === "On" ? gpt35ChatId : false
    );
    sendPrompt(
      "GPT4.0",
      messageValue,
      (res) => {
        setChatByModelId("GPT4.0", [
          ...res?.data.data.conversation.chat_history,
        ]);
        if (conversationMode === "On") {
          setGpt4ChatId(res?.data.data.conversation.pk);
        }
        setGpt4ChatLoading(false);
      },
      (err) => {
        setGpt4ChatError(err?.data?.errors);
        setGpt4ChatLoading(false);
      },
      conversationMode === "On" ? gpt4ChatId : false
    );
    sendPrompt(
      "Claude",
      messageValue,
      (res) => {
        setChatByModelId("Claude", [
          ...res?.data.data.conversation.chat_history,
        ]);
        if (conversationMode === "On") {
          setClaudeChatId(res?.data.data.conversation.pk);
        }
        setClaudeChatLoading(false);
      },
      (err) => {
        setClaudeChatError(err?.data?.errors);
        setClaudeChatLoading(false);
      },
      conversationMode === "On" ? claudeChatId : false
    );
    sendPrompt(
      "Llama",
      messageValue,
      (res) => {
        setChatByModelId("Llama", [
          ...res?.data?.data?.conversation?.chat_history,
        ]);
        if (conversationMode === "On") {
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
          ...res?.data.data.conversation.chat_history,
        ]);
        if (conversationMode === "On") {
          setMistralChatId(res?.data.data.conversation.pk);
        }
        setMistralChatLoading(false);
      },
      (err) => {
        setMistralChatError(err?.data?.errors);
        setMistralChatLoading(false);
      },
      conversationMode === "On" ? mistralChatId : false
    );
  };

  const sendMultipleInput = (modelId, messageValue) => {
    if (modelId === "GPT3.5") {
      setGpt35ChatLoading(true);
      sendPrompt(
        "GPT3.5",
        messageValue,
        (res) => {
          setChatByModelId("GPT3.5", [
            ...res?.data.data.conversation.chat_history,
          ]);
          if (conversationMode === "On") {
            setGpt35ChatId(res?.data.data.conversation.pk);
          }
          setGpt35ChatLoading(false);
        },
        (err) => {
          setGpt35ChatError(err?.data?.errors);
          setGpt35ChatLoading(false);
        },
        conversationMode === "On" ? gpt35ChatId : false
      );
    } else if (modelId === "GPT4.0") {
      setGpt4ChatLoading(true);
      sendPrompt(
        "GPT4.0",
        messageValue,
        (res) => {
          setChatByModelId("GPT4.0", [
            ...res?.data.data.conversation.chat_history,
          ]);
          if (conversationMode === "On") {
            setGpt4ChatId(res?.data.data.conversation.pk);
          }
          setGpt4ChatLoading(false);
        },
        (err) => {
          setGpt4ChatError(err?.data?.errors);
          setGpt4ChatLoading(false);
        },
        conversationMode === "On" ? gpt4ChatId : false
      );
    } else if (modelId === "Claude") {
      setClaudeChatLoading(true);
      sendPrompt(
        "Claude",
        messageValue,
        (res) => {
          setChatByModelId("Claude", [
            ...res?.data.data.conversation.chat_history,
          ]);
          if (conversationMode === "On") {
            setClaudeChatId(res?.data.data.conversation.pk);
          }
          setClaudeChatLoading(false);
        },
        (err) => {
          setClaudeChatError(err?.data?.errors);
          setClaudeChatLoading(false);
        },
        conversationMode === "On" ? claudeChatId : false
      );
    } else if (modelId === "Llama") {
      setLlamaChatLoading(true);
      sendPrompt(
        "Llama",
        messageValue,
        (res) => {
          setChatByModelId("Llama", [
            ...res?.data.data.conversation.chat_history,
          ]);
          if (conversationMode === "On") {
            setLlamaChatId(res?.data.data.conversation.pk);
          }
          setLlamaChatLoading(false);
        },
        (err) => {
          setLlamaChatError(err?.data?.errors);
          setLlamaChatLoading(false);
        },
        conversationMode === "On" ? llamaChatId : false
      );
    } else if (modelId === "Mistral") {
      setMistralChatLoading(true);
      sendPrompt(
        "Mistral",
        messageValue,
        (res) => {
          setChatByModelId("Mistral", [
            ...res?.data.data.conversation.chat_history,
          ]);
          if (conversationMode === "On") {
            setMistralChatId(res?.data.data.conversation.pk);
          }
          setMistralChatLoading(false);
        },
        (err) => {
          setMistralChatError(err?.data?.errors);
          setMistralChatLoading(false);
        },
        conversationMode === "On" ? mistralChatId : false
      );
    }
  };

  return (
    <>
      <FlexColumn>
        <BodyText style={{ fontSize: 14 }}>
          {isMultiPrompt === "Single input"
            ? "Your messages will be sent to all LLMs simultaneously"
            : "You can send messages to each LLM individually"}
        </BodyText>
        <RadioCheckbox
          options={["Single input", "Multi-input"]}
          onChange={(data) => setIsMultiPrompt(data)}
          defaultValue={"Single input"}
        />
      </FlexColumn>

      <FlexRow style={{ flexWrap: "wrap" }}>
        <Chat
          chat={models[0]}
          conversationMode={conversationMode === "On"}
          conversation={gpt35Chat}
          sendMultipleInput={sendMultipleInput}
          isLoading={gpt35ChatLoading}
          conversationId={gpt35ChatId}
          isMultiPrompt={isMultiPrompt}
          sendPrompt={sendPrompt}
        />
        <Chat
          chat={models[1]}
          conversationMode={conversationMode === "On"}
          conversation={gpt4Chat}
          sendMultipleInput={sendMultipleInput}
          isLoading={gpt4ChatLoading}
          conversationId={gpt4ChatId}
          isMultiPrompt={isMultiPrompt}
          sendPrompt={sendPrompt}
        />
        <Chat
          chat={models[2]}
          conversationMode={conversationMode === "On"}
          conversation={claudeChat}
          sendMultipleInput={sendMultipleInput}
          isLoading={claudeChatLoading}
          conversationId={claudeChatId}
          isMultiPrompt={isMultiPrompt}
          sendPrompt={sendPrompt}
        />
        <Chat
          chat={models[3]}
          conversationMode={conversationMode === "On"}
          conversation={llamaChat}
          sendMultipleInput={sendMultipleInput}
          isLoading={llamaChatLoading}
          conversationId={llamaChatId}
          isMultiPrompt={isMultiPrompt}
          sendPrompt={sendPrompt}
        />
        <Chat
          chat={models[4]}
          conversationMode={conversationMode === "On"}
          conversation={mistralChat}
          sendMultipleInput={sendMultipleInput}
          isLoading={mistralChatLoading}
          conversationId={mistralChatId}
          isMultiPrompt={isMultiPrompt}
          sendPrompt={sendPrompt}
        />
      </FlexRow>

      <div
        style={{
          width: "100%",
          borderBottom: `1px solid ${theme.borderColor}`,
        }}
      />

      <ContentBlock>
        {isMultiPrompt === "Single input" && (
          <SendMessage
            messageValue={messageValue}
            setMessageValue={setMessageValue}
            buttonIsLoading={buttonIsLoading}
            sendMultiplePrompt={sendMultiplePrompt}
          />
        )}

        <FlexRow style={{ width: "calc(100% - 84px)" }}>
          <TextArea
            label="Set instructions for the LLMs in the prompt configuration (eg. 'Talk like a pirate')"
            value={systemInstructions}
            onChange={setSystemInstructions}
            isFullWidth={true}
          />
        </FlexRow>
      </ContentBlock>
    </>
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
    <FlexColumn style={{ width: "calc(50% - 4px)", marginBottom: "8px" }}>
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
      {isMultiPrompt === "Multi-input" && (
        <FlexRow style={{ alignItems: "flex-end" }}>
          <TextArea
            isTextArea={true}
            label="Send a message"
            value={messageValue}
            onChange={setMessageValue}
            isFullWidth={true}
          />
          <Button
            text={buttonIsLoading ? "Sending..." : "Send"}
            onClick={() => {
              // setButtonIsLoading(true);
              sendMultipleInput(chat.name, messageValue);
              setMessageValue("");
            }}
            style={{
              width: "80px",
              height: "40px",
            }}
          />
        </FlexRow>
      )}
    </FlexColumn>
  );
};

const ChatMessages = ({ conversation }) => {
  const { theme } = useThemeStore();
  return (
    <FlexColumn
      style={{
        height: "300px",
        overflowY: "auto",
        // border: "1px solid #B6B6B6",
        padding: "4px",
        borderRadius: "4px",
        backgroundColor: theme.cardBackground,
      }}
    >
      {conversation.map((message, i) => (
        <ChatMessage key={i} message={message} />
      ))}
    </FlexColumn>
  );
};

const ChatMessage = ({ message }) => {
  const { theme } = useThemeStore();
  return (
    <div>
      <BodyText
        style={{
          fontWeight: message.role !== "user" && 800,
          color: theme.secondaryTextColor,
        }}
      >
        {message.content}
      </BodyText>
    </div>
  );
};

const SendMessage = ({
  messageValue,
  setMessageValue,
  buttonIsLoading,
  sendMultiplePrompt,
}) => {
  return (
    <FlexRow style={{ alignItems: "flex-end" }}>
      <TextArea
        label="Send a message"
        value={messageValue}
        onChange={setMessageValue}
        isFullWidth={true}
      />
      <Button
        text={buttonIsLoading ? "Sending..." : "Send"}
        onClick={() => {
          sendMultiplePrompt();
        }}
        style={{ width: "80px", height: "40px" }}
      />
    </FlexRow>
  );
};

export default ChatPanel;
