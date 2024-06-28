import { useEffect, useState } from "react";
import { FlexColumn } from "../layout/Flex";
import { ErrorText } from "./Text";

const TextInput = ({
  value = "",
  onChange = () => {},
  label = "Text Label",
  secretField = false,
  error = false,
  errorTitleOverride = false,
  disabled = false,
  isSplit = false,
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
    } else if (error.errorTitle && error.errorMessage) {
      if (error.errorTitle == label || error.errorTitle == errorTitleOverride) {
        setErrorMessage(error.errorMessage);
      }
    }
  }, [error]);

  return (
    <FlexColumn gap={4} style={{width: isSplit ? "calc(50% - 6px)" : "100%"}}>
      <label style={{ lineHeight: "22px", fontSize: "14px" }}>{label}</label>
      <input
        disabled={disabled}
        value={value}
        onChange={(e) => {
          setErrorMessage(false);
          onChange(e.target.value);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          height: "28px",
          borderRadius: "4px",
          border: `1px solid ${borderColor()}`,
          padding: "4px 8px",
        }}
        type={secretField && "password"}
      />
      {errorMessage && (
        <div style={{ width: "100%"}}>
          <ErrorText>{errorMessage}</ErrorText>
        </div>
      )}
    </FlexColumn>
  );
};

export default TextInput;
