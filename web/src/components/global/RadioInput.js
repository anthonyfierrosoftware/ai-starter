import React, { useState } from "react";
import { FlexColumn } from "../layout/Flex";
import { useThemeStore } from "../../state/stores";

const RadioCheckbox = ({
  options,
  onChange,
  isStacked = false,
  isCondensed = false,
  defaultValue = null,
  style = {},
}) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue);
  const { theme } = useThemeStore();

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    if (onChange) {
      onChange(option);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isStacked ? "column" : "row",
        gap: "8px",
        ...style,
      }}
    >
      {options.map((option) => (
        <FlexColumn
          style={{
            // backgroundColor: "red",
            backgroundColor:
              selectedOption === option
                ? theme.optionSelectedBackground
                : theme.optionUnselectedBackground,
            border: `1px solid ${theme.primaryActionColor}`,
            borderRadius: "4px",
            padding: "8px 4px",
            minWidth: isCondensed ? "60px" : "200px",
          }}
        >
          <label key={option}>
            <input
              type="radio"
              value={option}
              checked={selectedOption === option}
              onChange={() => handleOptionChange(option)}
            />
            {option}
          </label>
        </FlexColumn>
      ))}
    </div>
  );
};

export default RadioCheckbox;
