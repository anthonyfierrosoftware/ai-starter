import { useEffect, useState } from "react";
import { FlexColumn } from "../layout/Flex";
import { useThemeStore } from "../../state/stores";

const TextArea = ({
  value = "",
  onChange,
  label = "Text Label",
  error = false,
  errorTitleOverride = false,
  isFullWidth = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const [errorMessage, setErrorMessage] = useState(false);

  const { theme } = useThemeStore();

  const borderColor = () => {
    if (errorMessage) return "red";
    else if (isFocused) return "#C5C7C6";
    else if (!isFocused) return "#B5B7B6";
  };

  useEffect(() => {
    if (error?.length > 0) {
      error.forEach((err) => {
        if (err.errorTitle === label || err.errorTitle === errorTitleOverride)
          setErrorMessage(err.errorMessage);
      });
    }
  }, [error]);

  return (
    <FlexColumn gap={4} style={{ width: isFullWidth && "100%" }}>
      <label
        style={{ lineHeight: "22px", fontSize: "14px", color: theme.textColor }}
      >
        {label}
      </label>
      <textarea
        value={value}
        rows={4}
        onChange={(e) => {
          setErrorMessage(false);
          onChange(e.target.value);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          borderRadius: 4,
          border: `1px solid ${borderColor()}`,
          padding: "4px 8px",
          height: isFullWidth ? 30 : 60,
        }}
      />
      {errorMessage && (
        <div
          style={{
            width: 268,
            borderRadius: 4,
            color: "red",
          }}
        >
          <span>{errorMessage}</span>
        </div>
      )}
    </FlexColumn>
  );
};

export default TextArea;
