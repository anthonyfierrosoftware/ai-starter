import { useEffect, useState } from "react";
import { BodyText, Subheading } from "../global/Text";
import { FlexColumn, FlexRow } from "../layout/Flex";
import { fetchConversations } from "../../state/routes";
import { useAuthStore } from "../../state/stores";
import Button from "../global/Button";
import { formatDate } from "../../utils/formatDate";

const ConversationsPanel = ({ chatMode, onConversationSelected }) => {
  const [fetchedConversations, setFetchedConversations] = useState([]);
  const [isDisplayConversations, setIsDisplayConversations] = useState(true);

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
    <FlexColumn
      style={{ borderBottom: "1px solid #AAAAAA", paddingBottom: 16 }}
    >
      <FlexRow style={{ width: "100%", justifyContent: "space-between" }}>
        <Subheading>Conversations</Subheading>
        {chatMode == "Conversation Mode" && (
          <Button
            text={isDisplayConversations ? "Hide" : "Show"}
            onClick={() => setIsDisplayConversations(!isDisplayConversations)}
          />
        )}
      </FlexRow>
      {isDisplayConversations &&
        (chatMode == "Conversation Mode" ? (
          <FlexColumn>
            <FlexRow>
              <BodyText>
                Select a conversation to load it into the Chat Panel.
              </BodyText>
            </FlexRow>
            <FlexRow
              style={{
                flexWrap: "wrap",
                maxHeight: "200px",
                overflowX: "scroll",
                border: "1px solid black",
                padding: "4px",
                borderRadius: "4px",
              }}
            >
              {fetchedConversations?.map((conversation, i) => (
                <ConversationCard
                  key={i}
                  model={conversation.llmConfig?.chat_model}
                  name={conversation.name}
                  dateCreated={conversation.dateCreated}
                  dateUpdated={conversation.lastUpdated}
                  conversationData={conversation}
                  onClick={onConversationSelected}
                />
              ))}
              {fetchConversations?.length < 1 && (
                <BodyText style={{ padding: 8, color: "#777777" }}>
                  You have no conversations. Send a message while in
                  Conversation Mode to get started.
                </BodyText>
              )}
            </FlexRow>
          </FlexColumn>
        ) : (
          <FlexRow>
            <BodyText>
              Select Conversation Mode to view and load past conversations.
            </BodyText>
          </FlexRow>
        ))}
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

  return (
    <FlexColumn
      style={{
        backgroundColor: hovered ? "#E3E3E3" : "#F3F3F3",
        borderRadius: "4px",
        padding: "4px",
        cursor: "pointer",
        flex: 1,
        minWidth: 200,
        justifyContent: "space-between",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      gap={"8px"}
      onClick={() => {
        console.log("load conversation");
        onClick(conversationData);
      }}
    >
      <BodyText>
        <b>{model}</b> {name}
      </BodyText>
      <FlexColumn gap={4}>
        <BodyText style={{ fontSize: 11 }}>
          Created {formatDate(dateCreated)}
        </BodyText>
        <BodyText style={{ fontSize: 11 }}>
          Last updated {formatDate(dateUpdated)}
        </BodyText>
      </FlexColumn>
      {/* <FlexRow style={{ justifyContent: "space-between" }}> */}
      {/* </FlexRow> */}
    </FlexColumn>
  );
};

export default ConversationsPanel;
