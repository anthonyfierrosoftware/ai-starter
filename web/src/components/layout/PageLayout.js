// This file wraps all pages in the app to provide a consistent browsing experience

import { FlexColumn } from "./Flex";
import Navbar from "./Navbar";
import ContentContainer from "./ContentContainer";
import { useThemeStore } from "../../state/stores";

const PageLayout = ({
  children,
  displayNav = true,
  isCentered = false,
  ...props
}) => {
  const { theme } = useThemeStore();
  return (
    <FlexColumn
      style={{
        height: "100vh",
        width: "100vw",
        overflowY: "hidden",
        backgroundColor: theme.backgroundColor,
      }}
      gap={0}
    >
      {displayNav && <Navbar />}
      {isCentered ? (
        <ContentContainer
          isCentered={isCentered}
          style={{ backgroundColor: theme.backgroundColor }}
        >
          <FlexColumn
            style={{
              paddingLeft: 16,
              paddingTop: 16,
              backgroundColor: theme.backgroundColor,
            }}
          >
            {children}
          </FlexColumn>
        </ContentContainer>
      ) : (
        <FlexColumn style={{ backgroundColor: theme.backgroundColor }}>
          {children}
        </FlexColumn>
      )}
    </FlexColumn>
  );
};

export default PageLayout;
