import React from "react";
import { hubspot, Text } from "@hubspot/ui-extensions";

const Extension = () => {
  return (
    <>
      <Text>Hello World</Text>
    </>
  );
};

hubspot.extend(() => <Extension />);
