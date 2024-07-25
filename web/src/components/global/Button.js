import { useState } from "react";
import { FlexRow } from "../layout/Flex";
import { BodyText } from "./Text";
import { useThemeStore } from "../../state/stores";

const Button = ({
  text,
  onClick = () => {},
  style,
  isLoading = false,
  type = "default",
}) => {
  const [hovered, setHovered] = useState(false);
  const { theme } = useThemeStore();

  return (
    <button
      style={{
        width: "100px",
        height: "40px",
        borderColor: theme.secondaryActionBorder,
        borderRadius: "4px",
        borderWidth: 1,
        cursor: "pointer",
        backgroundColor: hovered
          ? type === "secondary"
            ? theme.secondaryActionHoverColor
            : theme.primaryActionHoverColor
          : type === "secondary"
          ? theme.secondaryActionColor
          : theme.primaryActionColor,
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
        <BodyText
          style={{
            margin: "auto 0",
            color:
              type === "secondary"
                ? theme.secondaryTextColor
                : theme.primaryTextColor,
          }}
        >
          {text}
        </BodyText>
      </FlexRow>
    </button>
  );
};

export default Button;
