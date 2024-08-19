import { useState } from "react";
import { FlexColumn, FlexRow } from "../components/layout/Flex";
import ContentColumn from "../components/layout/ContentColumn";
import PageLayout from "../components/layout/PageLayout";
import ChatPanel from "../components/llms/ChatPanel";
import ConversationsPanel from "../components/llms/ConversationsPanel";
import { useThemeStore } from "../state/stores";

const Home = () => {
  const [conversationMode, setConversationMode] = useState("Off");

  const [chatToLoad, setChatToLoad] = useState(false);

  const { theme } = useThemeStore();

  return (
    <PageLayout>
      <FlexRow gap={0}>
        {/* This is the sidebar */}
        <FlexColumn
          style={{
            // width: "248px",
            height: "100%",
            backgroundColor: theme.secondaryBackground,
            padding: "40px 16px",
            gap: "24px",
            overflowY: "scroll",
            maxHeight: "calc(100vh - 128px)",
          }}
        >
          <ConversationsPanel
            onConversationSelected={(conversation) =>
              setChatToLoad(conversation)
            }
            setConversationMode={setConversationMode}
            conversationMode={conversationMode}
          />
        </FlexColumn>
        <ContentColumn
          heading={"Chat Panel"}
          style={{
            backgroundColor: theme.backgroundColor,
            overflowY: "scroll",
            maxHeight: "calc(100vh - 88px)",
            width: "100%",
            paddingBottom: 20,
          }}
        >
          <ChatPanel
            chatToLoad={chatToLoad}
            conversationMode={conversationMode}
          />
        </ContentColumn>
      </FlexRow>
    </PageLayout>
  );
};

export default Home;
