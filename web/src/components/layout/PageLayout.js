// This file wraps all pages in the app to provide a consistent browsing experience

import { FlexColumn } from "./Flex";
import Navbar from "./Navbar";

const PageLayout = ({ children, displayNav = true, ...props }) => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <FlexColumn>
        {displayNav && <Navbar />}
        <FlexColumn style={{ padding: "20px" }}>{children}</FlexColumn>
      </FlexColumn>
    </div>
  );
};

export default PageLayout;
