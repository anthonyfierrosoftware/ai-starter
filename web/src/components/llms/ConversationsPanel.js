import { useEffect, useState } from "react";
import { BodyText, Subheading } from "../global/Text";
import { FlexColumn } from "../layout/Flex";
import { fetchConversations } from "../../state/routes";
import { useAuthStore, useThemeStore } from "../../state/stores";
import RadioCheckbox from "../global/RadioInput";
import { formatDate } from "../../utils/formatDate";

const ConversationsPanel = ({ onConversationSelected }) => {
  const [fetchedConversations, setFetchedConversations] = useState([]);

  const [conversationMode, setconversationMode] = useState("Off");
  const authState = useAuthStore((state) => state.auth);
  const apiHeaders = { Authorization: `Token ${authState.token}` };

  useEffect(() => {
    fetchConversations(
      (res) => {
        // console.log("convo fetch success", res);
        const newData = [...res.data.data];
        setFetchedConversations([...newData]);
      },
      (err) => console.log("error fetching conversations", err),
      { ...apiHeaders }
    );
  }, []);

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
        onChange={(data) => setconversationMode(data)}
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
        padding: "4px 0",
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
        <b>{model}</b> {name}
      </BodyText>
      <FlexColumn gap={2}>
        <BodyText style={{ fontSize: 11, color: theme.secondaryTextColor }}>
          Created {formatDate(dateCreated)}
        </BodyText>
        <BodyText style={{ fontSize: 11, color: theme.secondaryTextColor }}>
          Last updated {formatDate(dateUpdated)}
        </BodyText>
      </FlexColumn>
      {/* <FlexRow style={{ justifyContent: "space-between" }}> */}
      {/* </FlexRow> */}
    </FlexColumn>
  );
};

export default ConversationsPanel;
