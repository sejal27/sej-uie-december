import React, { useState, useEffect } from "react";
import { Checkbox, Text } from "@hubspot/ui-extensions";

export default function Task({
  name,
  description,
  label,
  completed,
  taskValue,
  onTaskChange,
}) {
  const [isChecked, setIsChecked] = useState(completed);

  const handleCheckboxChange = (checked) => {
    setIsChecked(checked);
    if (onTaskChange) {
      onTaskChange(checked, name);
    }
  };

  useEffect(() => {
    setIsChecked(completed);
  }, [completed]);

  return (
    <>
      <Checkbox
        name={name}
        label={label}
        checked={isChecked}
        onChange={handleCheckboxChange}
        description={description}
      >
        <Text
          format={{
            lineDecoration: completed ? "strikethrough" : "none",
          }}
        >
          {taskValue}
        </Text>
      </Checkbox>
    </>
  );
}
