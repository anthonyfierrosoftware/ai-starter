// Standardized component that groups content together
import { FlexColumn } from "./Flex";

const ContentBlock = ({ children, isCentered, ...props }) => {
  return (
    <FlexColumn gap={16} style={{alignItems: isCentered && "center"}}>{children}</FlexColumn>
  );
};

export default ContentBlock;