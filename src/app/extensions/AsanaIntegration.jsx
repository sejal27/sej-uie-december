import React from "react";
import { hubspot } from "@hubspot/ui-extensions";
import Task from "./components/Task.jsx";

const ASANA_WS_GID = "8587152060687";
const ASANA_TEAM_GID = "1202716730818736";

hubspot.extend(() => <Extension />);

const Extension = () => {
  return (
    <>
      {/* <Task name="checkbox" initialIsChecked={false} taskValue="Task 1 text" /> */}
    </>
  );
};
