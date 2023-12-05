import React from "react";
import { hubspot } from "@hubspot/ui-extensions";
import { Button, Panel, Text } from "@hubspot/ui-extensions";

hubspot.extend(({ runServerlessFunction, actions }) => (
  <Extension runServerlessFunction={runServerlessFunction} actions={actions} />
));

const Extension = ({ runServerlessFunction }) => {
  return (
    <>
      <Panel id="my-panel" title="Test Panel">
        <Text>Hello</Text>
      </Panel>
      <Button
        onClick={(__, reactions) => {
          return runServerlessFunction({ name: "myFunc" }).then(() => {
            reactions.openPanel("my-panel");
          });
        }}
      >
        Show Panel
      </Button>
    </>
  );
};
