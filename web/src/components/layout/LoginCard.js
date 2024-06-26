// Standardized component that envelops login and registration info fields
import { FlexColumn } from "./Flex";

const LoginCard = ({ children, ...props }) => {
  return (
    <FlexColumn className="login-card" gap={32}>{children}</FlexColumn>
  );
};

export default LoginCard;
