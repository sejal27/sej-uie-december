import React, { useState } from "react";
import { hubspot } from "@hubspot/ui-extensions";
import { Checkbox, Text } from "@hubspot/ui-extensions";

hubspot.extend(() => <Extension />);

const Extension = () => {
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (event) => {
    setIsChecked(event);
  };
  return (
    <>
      <Checkbox
        name="checkbox"
        label="Checkbox"
        initialIsChecked={false}
        onChange={handleCheckboxChange}
      >
        <Text format={{ lineDecoration: isChecked ? "strikethrough" : "none" }}>
          Checkbox value
        </Text>
      </Checkbox>
    </>
  );
};
