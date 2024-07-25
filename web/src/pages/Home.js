import { useState } from "react";
import { FlexColumn, FlexRow } from "../components/layout/Flex";
import ContentColumn from "../components/layout/ContentColumn";
import PageLayout from "../components/layout/PageLayout";
import ChatPanel from "../components/llms/ChatPanel";
import ConversationsPanel from "../components/llms/ConversationsPanel";
import { defaultTheme } from "../theme";
import { useThemeStore } from "../state/stores";

const Home = () => {
  const [conversationMode, setconversationMode] = useState("Off");

  const [chatToLoad, setChatToLoad] = useState(false);

  const { theme, setTheme } = useThemeStore();

  return (
    <PageLayout>
      <FlexRow gap={0}>
        {/* This is the sidebar */}
        <FlexColumn
          style={{
            width: "248px",
            height: "calc(100vh - 48px)",
            backgroundColor: theme.secondaryBackground,
            padding: "40px 16px",
            gap: "24px",
            overflowY: "auto",
          }}
        >
          <ConversationsPanel
            conversationMode={conversationMode}
            onConversationSelected={(conversation) =>
              setChatToLoad(conversation)
            }
          />
        </FlexColumn>
        <ContentColumn
          heading={"Chat Panel"}
          style={{ backgroundColor: theme.backgroundColor }}
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
