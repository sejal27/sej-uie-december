import React from "react";
import { Checkbox, Text } from "@hubspot/ui-extensions";

export default function Task({
  name,
  description,
  label,
  completed,
  taskValue,
  onTaskChange,
}) {
  const handleCheckboxChange = (checked) => {
    if (onTaskChange) {
      onTaskChange(checked, name);
    }
  };
  return (
    <>
      <Checkbox
        name={name}
        label={label}
        initialIsChecked={completed}
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
