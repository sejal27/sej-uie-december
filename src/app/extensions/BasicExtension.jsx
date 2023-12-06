import React from "react";
import { hubspot } from "@hubspot/ui-extensions";
import Task from "./components/Task.jsx";

hubspot.extend(() => <Extension />);

const Extension = () => {
  return (
    <>
      <Task name="checkbox" initialIsChecked={false} taskValue="Task 1 text" />
      <Task name="checkbox" initialIsChecked={false} taskValue="Task 2 text" />
      <Task name="checkbox" initialIsChecked={false} taskValue="Task 3 text" />
    </>
  );
};
