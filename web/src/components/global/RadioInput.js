import React, { useState } from "react";
import { FlexColumn, FlexRow } from "../layout/Flex";

const RadioCheckbox = ({
  options,
  onChange,
  isStacked = false,
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
    <div
      style={{
        display: 'flex',
        flexDirection: isStacked ? 'column' : 'row',
        gap: '8px',
        ...style,
      }}
    >
      {options.map((option) => (
        <FlexColumn
          style={{
            backgroundColor: selectedOption === option ? '#b5b5b5': "#ffffff",
            border: '1px solid black',
            borderRadius: "4px",
            padding: "16px 8px",
            minWidth: '200px'
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
