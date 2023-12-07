import React, { useState } from "react";
import { hubspot, Button, Flex, Box } from "@hubspot/ui-extensions";
import Task from "./components/Task.jsx";

const ASANA_WS_GID = "8587152060687";
const ASANA_TEAM_GID = "1206118327825301";
const ASANA_PROJECT_GID = "1206117893165586";

const Asana = ({ runServerlss, fetchProperties, context }) => {
  const [AsanaTasks, setAsanaTasks] = useState([]);
  const [TeamUsers, setTeamUsers] = usestate([]);

  const [loading, setLoading] = useState(true);

  const getAsanaTasks = () => {
    runServerlss({
      name: "getAsanaTasks",
      parameters: {
        // ASANA_WS_GID: ASANA_WS_GID,
        ASANA_TEAM_GID: ASANA_TEAM_GID,
        ASANA_PROJECT_GID: ASANA_PROJECT_GID,
      },
    })
      .then((resp) => {
        setAsanaTasks(resp);
      })
      .finally(() => setLoading(false));
  };
  return (
    <Flex direction="column" gap="md">
      <Task name="checkbox" initialIsChecked={false} taskValue="Task 1 text" />
      <Box>
        <Button size="sm" onClick={getAsanaTasks}>
          Refresh
        </Button>
      </Box>
    </Flex>
  );
};

hubspot.extend(({ runServerlessFunction, actions, context }) => (
  <Asana
    runServerlss={runServerlessFunction}
    fetchProperties={actions.fetchCrmObjectProperties}
    context={context}
  />
));
