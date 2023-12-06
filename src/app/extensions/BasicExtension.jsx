import React, { useState } from "react";
import { hubspot } from "@hubspot/ui-extensions";
import { Checkbox, Text } from "@hubspot/ui-extensions";

hubspot.extend(() => <Extension />);

const Extension = () => {
  const [isChecked, setIsChecked] = useState(true);
  const handleCheckboxChange = (checked) => {
    setIsChecked(checked);
    console.log(`checked: ${checked}`);
  };
  return (
    <>
      <Checkbox
        name="checkbox"
        label="Checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
      >
        <Text format={{ lineDecoration: isChecked ? "strikethrough" : "none" }}>
          Checkbox value
        </Text>
      </Checkbox>
    </>
  );
};
