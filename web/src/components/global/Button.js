import { useState } from "react";
import { FlexRow } from "../layout/Flex";
import { BodyText } from "./Text";

const Button = ({ text, onClick = () => {}, style, isLoading = false }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      style={{
        width: "100px",
        height: "40px",
        border: "1px solid #CCCCCC",
        borderRadius: "4px",
        cursor: "pointer",
        backgroundColor: hovered ? "#EEEEEE" : "white",

        fontWeight: 600,
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick()}
    >
      <FlexRow gap={8} style={{ justifyContent: "center" }}>
        {isLoading && (
          <img
            src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif"
            width="20px"
            height="20px"
          />
        )}
        <BodyText style={{ margin: "auto 0" }}>{text}</BodyText>
      </FlexRow>
    </button>
  );
};

export default Button;
