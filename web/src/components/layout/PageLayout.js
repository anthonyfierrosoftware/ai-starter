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
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: theme.backgroundColor,
      }}
    >
      <FlexColumn style={{ height: "100%" }} gap={0}>
        {displayNav && <Navbar />}
        {isCentered ? (
          <ContentContainer isCentered={isCentered}>
            <FlexColumn style={{ paddingLeft: 16, paddingTop: 16 }}>
              {children}
            </FlexColumn>
          </ContentContainer>
        ) : (
          children
        )}
      </FlexColumn>
    </div>
  );
};

export default PageLayout;
