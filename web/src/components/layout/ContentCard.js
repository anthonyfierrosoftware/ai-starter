// Standardized component that envelops login and registration info fields
import { FlexColumn } from "./Flex";
import { Heading, Subheading } from "../global/Text";

const ContentCard = ({ children, heading, subheading, isCentered = false }) => {
  return (
    <FlexColumn
      style={{
        alignItems: isCentered && "center",
        padding: "32px 24px",
        borderRadius: "16px",
        minHeight: "400px",
        width: "320px",
        boxShadow: "2px 2px 8px 2px rgba(0, 0, 0, 0.12)",
        marginTop: "18vh",
      }}
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

      {children}
    </FlexColumn>
  );
};

export default ContentCard;
