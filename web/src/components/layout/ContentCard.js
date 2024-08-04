// Standardized component that envelops login and registration info fields
import { FlexColumn } from "./Flex";
import { Heading, Subheading } from "../global/Text";

const ContentCard = ({
  children,
  heading,
  subheading,
  isCentered = false,
  ...props
}) => {
  return (
    <FlexColumn
      className="content-card"
      style={{ alignItems: isCentered && "center" }}
      gap={16}
    >
      {heading && (
        <Heading
          style={{ textAlign: isCentered && "center", marginBottom: "16px" }}
        >
          {heading}
        </Heading>
      )}

      {subheading && (
        <Subheading style={{ textAlign: isCentered && "center" }}>
          {subheading}
        </Subheading>
      )}
      {/* {subheading && <div style={{width: "100%", borderBottom: "1px solid black"}}/>} */}

      {children}
    </FlexColumn>
  );
};

export default ContentCard;
