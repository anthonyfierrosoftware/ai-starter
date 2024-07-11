import { useState } from "react";
import { BodyText, Heading, Subheading } from "../components/global/Text";
import { FlexColumn, FlexRow } from "../components/layout/Flex";
import ContentColumn from "../components/layout/ContentColumn";
import PageLayout from "../components/layout/PageLayout";
import ChatPanel from "../components/llms/ChatPanel";
import ConversationsPanel from "../components/llms/ConversationsPanel";
import RadioCheckbox from "../components/global/RadioInput";
import ContentBlock from "../components/layout/ContentBlock";

const Home = () => {
  const [chatMode, setChatMode] = useState("Single Prompt Mode");

  const [chatToLoad, setChatToLoad] = useState(false);

  return (
    <PageLayout>
      <FlexRow gap={0}>
        <FlexColumn style={{width: '248px', height: '100vh', backgroundColor:'#F3F3F3', padding: '40px 16px', gap: '24px', overflowY: 'scroll'}}>
          <ContentBlock>
            <Subheading>Settings</Subheading>
            <RadioCheckbox
              options={["Single Prompt Mode", "Conversation Mode"]}
              onChange={(data) => setChatMode(data)}
              defaultValue={"Single Prompt Mode"}
              isStacked={true}
            />
          </ContentBlock>
          <ConversationsPanel
            chatMode={chatMode}
            onConversationSelected={(conversation) => setChatToLoad(conversation)}
          />
        </FlexColumn>
        <ContentColumn heading={"Home"}>
          <ChatPanel chatToLoad={chatToLoad} chatMode={chatMode} />
        </ContentColumn>
      </FlexRow>
    </PageLayout>
  );
};

export default Home;
