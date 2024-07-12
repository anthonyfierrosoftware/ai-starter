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
  const [chatMode, setChatMode] = useState("Off");
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
        {chatMode == "On" && (
          <Button
            text={isDisplayConversations ? "Hide" : "Show"}
            onClick={() => setIsDisplayConversations(!isDisplayConversations)}
          />
        )}
      </FlexRow> */}
      <Subheading>Conversation Mode</Subheading>
      <BodyText style={{fontSize: '14px'}}>
        {chatMode == "On" ?
          <>
          {fetchedConversations?.length > 0 ? "Select a conversation to load it into the chat panel" : "Send a message to get started"}
          </> 
          :
          "Your conversation history will not be saved"
        }
      </BodyText>
      <RadioCheckbox
        options={["Off", "On"]}
        onChange={(data) => setChatMode(data)}
        defaultValue={"Off"}
        isCondensed={true}
      />
      {
        (chatMode == "On" ? (
          <FlexColumn style={{overflowY: 'auto'}} gap={0}>
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
      gap={4}
      onClick={() => {
        console.log("load conversation");
        onClick(conversationData);
      }}
    >
      <BodyText style={{fontSize: 14}}>
        <b>{model}</b> {name}
      </BodyText>
      <FlexColumn gap={2}>
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
