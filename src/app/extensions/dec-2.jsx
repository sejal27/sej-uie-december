import React from "react";
import { hubspot, Text } from "@hubspot/ui-extensions";

// Define the extension to be run within the Hubspot CRM
hubspot.extend(({ runServerlessFunction }) => (
  <December2 runServerless={runServerlessFunction} />
));

const December2 = () => {
  return (
    <>
      <Text>Hello World</Text>
    </>
  );
};
