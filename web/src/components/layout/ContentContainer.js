// Standardized component that envelops a content list and centers it horizontally on larger monitors

import { FlexColumn } from "./Flex";

const ContentContainer = ({ children, ...props }) => {
  return (
    <FlexColumn className="content-container">{children}</FlexColumn>
  );
};

export default ContentContainer;
