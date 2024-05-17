import React, { useState } from "react";
import { FlexColumn, FlexRow } from "../layout/Flex";

const RadioCheckbox = ({
  options,
  onChange,
  defaultValue = null,
  style = {},
}) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    if (onChange) {
      onChange(option);
    }
  };

  return (
    <FlexRow
      style={{
        backgroundColor: "#F3F3F3",
        borderRadius: "4px",
        padding: "16px",
        maxHeight: "22px",
        ...style,
      }}
    >
      {options.map((option) => (
        <FlexColumn>
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
    </FlexRow>
  );
};

export default RadioCheckbox;
