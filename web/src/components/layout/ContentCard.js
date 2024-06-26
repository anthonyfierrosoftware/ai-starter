// Standardized component that envelops login and registration info fields
import { FlexColumn } from "./Flex";
import { Heading, Subheading } from "../global/Text";

const ContentCard = ({ children, heading, subheading, ...props }) => {
  return (
    <FlexColumn className="login-card" gap={32}>

        {heading && <Heading>{heading}</Heading>}    
        
        {subheading && <Subheading>{subheading}</Subheading>}

        {children}
        
    </FlexColumn>
  );
};

export default ContentCard;
