import React, { useState, useEffect } from "react";
import { hubspot, Button, Flex, Box } from "@hubspot/ui-extensions";
import TasksTable from "./components/TaskTable.jsx";

// const ASANA_WS_GID = "8587152060687";
const ASANA_TEAM_GID = "1206118327825301";
const ASANA_PROJECT_GID = "1206117893165586";

const Asana = ({ runServerlss, fetchProperties, context }) => {
  const [AsanaTasks, setAsanaTasks] = useState([]);
  const [TeamUsers, setTeamUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const getAsanaTasks = () => {
    setLoading(true);
    runServerlss({
      name: "getAsanaTasks",
      parameters: {
        ASANA_PROJECT_GID: ASANA_PROJECT_GID,
      },
    })
      .then((resp) => {
        setAsanaTasks(resp.response);
      })
      .finally(() => setLoading(false));
  };

  const getAsanaTeamUsers = () => {
    setLoading(true);
    runServerlss({
      name: "getAsanaTeamUsers",
      parameters: {
        ASANA_TEAM_GID: ASANA_TEAM_GID,
      },
    })
      .then((resp) => {
        setTeamUsers(resp.response.data);
      })
      .finally(() => setLoading(false));
  };

  const getTasks = () => {
    getAsanaTasks();
    getAsanaTeamUsers();
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <>
      <TasksTable tasks={AsanaTasks} users={TeamUsers} />
      <Button size="sm" onClick={getTasks}>
        Refresh
      </Button>
    </>
  );
};

hubspot.extend(({ runServerlessFunction, actions, context }) => (
  <Asana
    runServerlss={runServerlessFunction}
    fetchProperties={actions.fetchCrmObjectProperties}
    context={context}
  />
));
