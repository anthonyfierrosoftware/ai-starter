// This file wraps all pages in the app to provide a consistent browsing experience

import { FlexColumn } from "./Flex";
import Navbar from "./Navbar";
import ContentContainer from "./ContentContainer";

const PageLayout = ({
  children,
  displayNav = true,
  isCentered = false,
  ...props
}) => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <FlexColumn style={{ height: "100%" }} gap={0}>
        {displayNav && <Navbar />}
        {isCentered ? (
          <ContentContainer isCentered={isCentered}>
            {children}
          </ContentContainer>
        ) : (
          children
        )}
      </FlexColumn>
    </div>
  );
};

export default PageLayout;
