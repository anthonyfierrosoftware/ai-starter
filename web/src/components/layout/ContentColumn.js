// Standardized component for displaying content in a list

import { FlexColumn } from "./Flex";

const ContentColumn = ({ children, ...props }) => {
  return (
    <FlexColumn className="content-column">{children}</FlexColumn>
  );
};

export default ContentColumn;
