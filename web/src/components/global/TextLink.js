import { BodyText } from "./Text";

const TextLink = ({ children, onClick = () => {}, style = {} }) => {
  return (
    <BodyText
      style={{
        display: "inline-block",
        fontWeight: 600,
        textDecoration: "underline",
        cursor: "pointer",
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </BodyText>
  );
};

export default TextLink;
