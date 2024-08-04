import { useState } from "react";

import { BodyText, Subheading } from "../global/Text";
import { FlexColumn } from "../layout/Flex";
import { useThemeStore } from "../../state/stores";
import RadioCheckbox from "../global/RadioInput";

import { formatDate } from "../../utils/formatDate";

const ConversationsPanel = ({
  onConversationSelected,
  setConversationMode,
  conversationMode,
  fetchedConversations,
}) => {
  return (
    <FlexColumn style={{ minWidth: 280 }}>
      <Subheading>Conversation Mode</Subheading>
      <BodyText style={{ fontSize: "14px" }}>
        {conversationMode === "On" ? (
          <>
            {fetchedConversations?.length > 0
              ? "Select a conversation to load it into the chat panel"
              : "Send a message to get started"}
          </>
        ) : (
          "Your conversation history will not be saved"
        )}
      </BodyText>
      <RadioCheckbox
        options={["Off", "On"]}
        onChange={(data) => setConversationMode(data)}
        defaultValue={"Off"}
        isCondensed={true}
      />
      {conversationMode === "On" ? (
        <FlexColumn style={{ overflowY: "auto" }} gap={4}>
          {fetchedConversations?.map((conversation, i) => (
            <ConversationCard
              key={i}
              model={conversation.llmConfig?.chat_model}
              name={conversation.name}
              dateCreated={conversation.date_created}
              dateUpdated={conversation.last_updated}
              conversationData={conversation}
              onClick={onConversationSelected}
            />
          ))}
        </FlexColumn>
      ) : (
        <></>
      )}
    </FlexColumn>
  );
};

const ConversationCard = ({
  model,
  name,
  dateCreated,
  dateUpdated,
  onClick = () => {},
  conversationData,
}) => {
  const [hovered, setHovered] = useState(false);
  const { theme } = useThemeStore();
  return (
    <FlexColumn
      style={{
        backgroundColor: hovered
          ? theme.secondaryActionHoverColor
          : theme.secondaryActionColor,
        borderRadius: 4,
        padding: 4,
        cursor: "pointer",
        flex: 1,
        minWidth: 200,
        justifyContent: "space-between",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      gap={4}
      onClick={() => {
        // console.log("load conversation");
        onClick(conversationData);
      }}
    >
      <BodyText style={{ fontSize: 14, color: theme.secondaryTextColor }}>
        <b>{conversationData.llm_config.chat_model}</b>
      </BodyText>
      <BodyText style={{ fontSize: 14, color: theme.secondaryTextColor }}>
        {name}
      </BodyText>
      <FlexColumn gap={2}>
        <BodyText style={{ fontSize: 11, color: theme.secondaryTextColor }}>
          Created {formatDate(dateCreated)}
        </BodyText>
        <BodyText style={{ fontSize: 11, color: theme.secondaryTextColor }}>
          Last updated {formatDate(dateUpdated)}
        </BodyText>
        <BodyText style={{ fontSize: 11, color: theme.secondaryTextColor }}>
          Token Spend:{" "}
          {conversationData.claude_tokens ||
            conversationData.gpt3_tokens ||
            conversationData.gpt4_tokens ||
            conversationData.llama2_tokens ||
            conversationData.mistral_tokens ||
            conversationData.hugging_other_tokens}
        </BodyText>
      </FlexColumn>
      {/* <FlexRow style={{ justifyContent: "space-between" }}> */}
      {/* </FlexRow> */}
    </FlexColumn>
  );
};

export default ConversationsPanel;
