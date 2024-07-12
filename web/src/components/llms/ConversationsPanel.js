import { useEffect, useState } from "react";
import { BodyText, Subheading } from "../global/Text";
import { FlexColumn, FlexRow } from "../layout/Flex";
import { fetchConversations } from "../../state/routes";
import { useAuthStore } from "../../state/stores";
import RadioCheckbox from "../global/RadioInput";
import { formatDate } from "../../utils/formatDate";

const ConversationsPanel = ({ onConversationSelected }) => {
  const [fetchedConversations, setFetchedConversations] = useState([]);
  // const [isDisplayConversations, setIsDisplayConversations] = useState(true);
  const [chatMode, setChatMode] = useState("Single Prompt Mode");
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
    <FlexColumn>
      {/* <FlexRow style={{ width: "100%", justifyContent: "space-between" }}>
        <Subheading>Conversations</Subheading>
        {chatMode == "Conversation Mode" && (
          <Button
            text={isDisplayConversations ? "Hide" : "Show"}
            onClick={() => setIsDisplayConversations(!isDisplayConversations)}
          />
        )}
      </FlexRow> */}
      <Subheading>Conversations</Subheading>
      <BodyText style={{fontSize: '14px'}}>
        {chatMode == "Conversation Mode" ?
          <>
          {fetchedConversations?.length > 0 ? "Select a conversation to load it into a chat panel" : "Send a message to get started"}
          </> 
          :
          "Select conversation mode to view and load past conversations"
        }
      </BodyText>
      <RadioCheckbox
        options={["Single Prompt Mode", "Conversation Mode"]}
        onChange={(data) => setChatMode(data)}
        defaultValue={"Single Prompt Mode"}
        isStacked={true}
      />
      {
        (chatMode == "Conversation Mode" ? (
          <FlexColumn>
            <FlexRow
              style={{
                flexWrap: "wrap",
                overflowX: "scroll",
              }}
            >
              {fetchedConversations?.map((conversation, i) => (
                <ConversationCard
                  key={i}
                  model={conversation.llm_config?.chat_model}
                  name={conversation.name}
                  dateCreated={conversation.date_created}
                  dateUpdated={conversation.last_updated}
                  conversationData={conversation}
                  onClick={onConversationSelected}
                />
              ))}
            </FlexRow>
          </FlexColumn>
        ) : (
          <>
          </>
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
        // borderRadius: "4px",
        padding: "4px 0",
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
