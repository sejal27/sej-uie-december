import React, { useState } from "react";
import { Checkbox, Text } from "@hubspot/ui-extensions";

export default function Task({
  name,
  description,
  label,
  initialIsChecked,
  taskValue,
}) {
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (checked) => {
    setIsChecked(checked);
  };
  return (
    <>
      <Checkbox
        name={name}
        label={label}
        initialIsChecked={initialIsChecked}
        onChange={handleCheckboxChange}
        description={description}
      >
        <Text format={{ lineDecoration: isChecked ? "strikethrough" : "none" }}>
          {taskValue}
        </Text>
      </Checkbox>
    </>
  );
}
