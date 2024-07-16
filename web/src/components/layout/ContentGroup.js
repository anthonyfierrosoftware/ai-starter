// Standardized component for grouping content blocks together

import { Subheading } from "../global/Text";
import { FlexColumn } from "./Flex";

const ContentGroup = ({ children, subheading, ...props }) => {
  return (
    <FlexColumn style={{gap: '16px', maxWidth: "420px"}}>
        {subheading && <Subheading>{subheading}</Subheading>}
        {children}
    </FlexColumn>
  );
};

export default ContentGroup;