import React, { useState } from "react";
import { Checkbox, Text } from "@hubspot/ui-extensions";

export default function Task({
  name,
  description,
  label,
  completed,
  initialIsChecked,
  taskValue,
  onTaskChange,
}) {
  // console.log(taskValue, completed);
  // const [isChecked, setIsChecked] = useState(completed);
  const handleCheckboxChange = (checked) => {
    // setIsChecked(checked);
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
