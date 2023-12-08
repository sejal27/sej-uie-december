import React, { useState, useEffect } from "react";
import {
  hubspot,
  Button,
  Flex,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  LoadingSpinner,
  Tag,
  Link,
} from "@hubspot/ui-extensions";
import Task from "./components/Task.jsx";
import User from "./components/User.jsx";

// const ASANA_WS_GID = "8587152060687";
const ASANA_TEAM_GID = "1206118327825301";
const ASANA_PROJECT_GID = "1206117893165586";

const Asana = ({ runServerlss }) => {
  const [tasks, setAsanaTasks] = useState([]);
  const [users, setTeamUsers] = useState([]);
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

  const getUser = (gid) => {
    const user = users.find((user) => user.gid === gid);
    return user ? user : "Unknown";
  };

  // const getTask = (gid) => {
  //   const task = tasks.find((task) => task.gid === gid);
  //   return task ? task : "Unknown";
  // };

  const handleTaskChange = async (checked, gid) => {
    try {
      const response = await updateTaskInAsana(gid, checked);
      if (response && response.status !== 200) {
        setAsanaTasks((prevTasks) =>
          prevTasks.map((task) => {
            if (task.gid === gid) {
              return { ...task, completed: checked };
            }
            return task;
          })
        );
      }
    } catch (error) {
      console.error("Error updating task in Asana", error);
      setAsanaTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.gid === gid) {
            return { ...task, completed: checked };
          }
          return task;
        })
      );
    }
  };

  const updateTaskInAsana = async (gid, checked) => {
    try {
      const response = await runServerlss({
        name: "updateAsanaTask",
        parameters: {
          GID: gid,
          completed: checked,
        },
      });

      return response;
    } catch (error) {
      console.error("Error updating task in Asana", error);
    }
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
      {loading && (
        <LoadingSpinner size="sm" showLabel={true} label="🦄 Refreshing... " />
      )}

      {!loading && (
        <>
          <Table>
            <TableBody>
              {tasks.map((task) => {
                const user = task.assignee ? getUser(task.assignee.gid) : null;
                return (
                  <TableRow width="min" key={task.gid}>
                    <TableCell>
                      <Task
                        name={task.gid}
                        // initialIsChecked={task.completed ? true : false}
                        completed={task.completed ? true : false}
                        taskValue={
                          <Link href={task.permalink_url}>{task.name}</Link>
                        }
                        onTaskChange={handleTaskChange}
                      />
                    </TableCell>
                    <TableCell>
                      {user ? (
                        <User
                          name={user.name}
                          photo={user.photo ? user.photo.image_21x21 : null}
                        />
                      ) : (
                        "None"
                      )}
                    </TableCell>
                    <TableCell>
                      <Tag variant={task.completed ? "success" : "warning"}>
                        {task.completed ? "Complete" : "Incomplete"}
                      </Tag>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Divider />
          <Button size="sm" onClick={getTasks}>
            Refresh
          </Button>
        </>
      )}
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
