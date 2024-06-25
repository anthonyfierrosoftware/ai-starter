import { useState } from "react";
import { BodyText, Heading } from "../components/global/Text";
import { FlexColumn, FlexRow } from "../components/layout/Flex";
import ContentColumn from "../components/layout/ContentColumn";
import PageLayout from "../components/layout/PageLayout";
import ChatPanel from "../components/llms/ChatPanel";
import ConversationsPanel from "../components/llms/ConversationsPanel";
import RadioCheckbox from "../components/global/RadioInput";

const Home = () => {
  const [chatMode, setChatMode] = useState("Single Prompt Mode");

  const [chatToLoad, setChatToLoad] = useState(false);

  return (
    <PageLayout>
      <ContentColumn>
        <Heading>Home</Heading>
        <FlexColumn>
          <BodyText>
            Toggle between Conversation and Single Prompt mode to enable or
            disable LLM chat history.
          </BodyText>
          <FlexRow>
            <RadioCheckbox
              options={["Conversation Mode", "Single Prompt Mode"]}
              onChange={(data) => setChatMode(data)}
              defaultValue={"Single Prompt Mode"}
            />
          </FlexRow>
        </FlexColumn>
        <ConversationsPanel
          chatMode={chatMode}
          onConversationSelected={(conversation) => setChatToLoad(conversation)}
        />
        <ChatPanel chatToLoad={chatToLoad} chatMode={chatMode} />
      </ContentColumn>
    </PageLayout>
  );
};

export default Home;
