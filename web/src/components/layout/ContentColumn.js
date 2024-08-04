// Standardized component for displaying content in a list

import { Heading } from "../global/Text";
import { FlexColumn } from "./Flex";

const ContentColumn = ({ children, heading, style = {} }) => {
  return (
    <FlexColumn
      className="content-column"
      gap={24}
      style={{ padding: 24, ...style }}
    >
      {heading && <Heading>{heading}</Heading>}
      {children}
    </FlexColumn>
  );
};

export default ContentColumn;
