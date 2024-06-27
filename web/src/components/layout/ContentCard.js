// Standardized component that envelops login and registration info fields
import { FlexColumn } from "./Flex";
import { Heading, Subheading } from "../global/Text";

const ContentCard = ({ children, heading, subheading, isCentered=false, ...props }) => {
  return (
    <FlexColumn className="content-card" style={{alignItems: isCentered && "center"}} gap={32}>

        {heading && <Heading style={{textAlign: isCentered && "center"}}>{heading}</Heading>}    
        
        {subheading && <Subheading style={{textAlign: isCentered && "center"}}>{subheading}</Subheading>}

        {children}
        
    </FlexColumn>
  );
};

export default ContentCard;
