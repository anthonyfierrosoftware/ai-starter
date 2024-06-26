import { useEffect, useState } from "react";
import { FlexColumn } from "../layout/Flex";

const TextArea = ({
  value = "",
  onChange,
  label = "Text Label",
  secretField = false,
  error = false,
  errorTitleOverride = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const [errorMessage, setErrorMessage] = useState(false);

  const borderColor = () => {
    if (errorMessage) return "red";
    else if (isFocused) return "#C5C7C6";
    else if (!isFocused) return "#B5B7B6";
  };

  useEffect(() => {
    if (error?.length > 0) {
      error.forEach((err) => {
        if (err.errorTitle == label || err.errorTitle == errorTitleOverride)
          setErrorMessage(err.errorMessage);
      });
    }
  }, [error]);

  return (
    <FlexColumn gap={4}>
      <label style={{ lineHeight: "22px", fontSize: "14px" }}>{label}</label>
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
          height: "60px",
          borderRadius: "4px",
          border: `1px solid ${borderColor()}`,
          // width: "268px",
          padding: "8px 16px",
        }}
        type={secretField && "password"}
      />
      {errorMessage && (
        <div
          style={{
            width: "268px",
            borderRadius: "4px",
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
