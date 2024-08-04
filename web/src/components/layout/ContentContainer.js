// Standardized component that envelops a content list and centers it horizontally on larger monitors

import { FlexColumn } from "./Flex";

const ContentContainer = ({ children, isCentered=false, ...props }) => {
  return (
    <FlexColumn className="content-container" gap={0} style={{justifyContent: isCentered && "center"}}>{children}</FlexColumn>
  );
};

export default ContentContainer;
