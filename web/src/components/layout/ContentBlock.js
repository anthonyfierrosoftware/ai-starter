// Standardized component that groups content together
import { FlexColumn } from "./Flex";

const ContentBlock = ({ children, center, ...props }) => {
  return (
    <FlexColumn gap={16} style={{alignItems: center && "center"}}>{children}</FlexColumn>
  );
};

export default ContentBlock;