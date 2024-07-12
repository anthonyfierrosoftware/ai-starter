import { useState } from "react";
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
      <FlexRow gap={0}>
        {/* This is the sidebar */}
        <FlexColumn style={{width: '248px', height: '100vh', backgroundColor:'#F3F3F3', padding: '40px 16px', gap: '24px', overflowY: 'scroll'}}>
          <ConversationsPanel
            chatMode={chatMode}
            onConversationSelected={(conversation) => setChatToLoad(conversation)}
          />
        </FlexColumn>
        <ContentColumn heading={"Chat Panel"}>
          <ChatPanel chatToLoad={chatToLoad} chatMode={chatMode} />
        </ContentColumn>
      </FlexRow>
    </PageLayout>
  );
};

export default Home;
