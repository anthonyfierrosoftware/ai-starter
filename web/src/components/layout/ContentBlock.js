// Standardized component that groups content together
import { FlexColumn } from "./Flex";

const ContentBlock = ({ children, isCentered = false, isLast = false, ...props }) => {
  return (
    <FlexColumn gap={12} style={{alignItems: isCentered && "center", marginTop: isLast && "auto"}}>{children}</FlexColumn>
  );
};

export default ContentBlock;