import React, { useState, useEffect } from "react";
import {
  hubspot,
  Button,
  // ExperimentalPanel,
  Table,
  TableBody,
  TableCell,
  TableRow,
  LoadingSpinner,
  Tag,
  Link,
  TableHeader,
  TableHead,
} from "@hubspot/ui-extensions";
import Task from "./components/Task.jsx";
import User from "./components/User.jsx";

// const ASANA_WS_GID = "8587152060687";
const ASANA_TEAM_GID = "1206118327825301";
const ASANA_PROJECT_GID = "1206117893165586";

const Asana = ({ runServerlss }) => {
  const [page, setPage] = useState(1);
  const [tasks, setAsanaTasks] = useState([]);
  const [users, setTeamUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAsanaTasks = () => {
    runServerlss({
      name: "getAsanaTasks",
      parameters: {
        ASANA_PROJECT_GID: ASANA_PROJECT_GID,
      },
    }).then((resp) => {
      setAsanaTasks(resp.response);
    });
  };

  const getAsanaTeamUsers = () => {
    runServerlss({
      name: "getAsanaTeamUsers",
      parameters: {
        ASANA_TEAM_GID: ASANA_TEAM_GID,
      },
    }).then((resp) => {
      setTeamUsers(resp.response.data);
    });
  };

  const getUser = (gid) => {
    const user = users.find((user) => user.gid === gid);
    return user ? user : "Not in Team";
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
    setLoading(true);
    setTimeout(() => {
      getAsanaTasks();
      getAsanaTeamUsers();
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    getTasks();
  }, []);

  const PAGE_SIZE = 5;

  const totalPages = Math.ceil((tasks || []).length / PAGE_SIZE);
  const paginatedItems = (tasks || []).slice(
    (page - 1) * PAGE_SIZE,
    (page - 1) * PAGE_SIZE + PAGE_SIZE
  );

  const DEFAULT_STATE = {
    name: "ascending",
    assignee: "ascending",
    completed: "ascending",
  };
  const [sortState, setSortState] = useState({ ...DEFAULT_STATE });
  console.log(sortState.completed);
  function handleOnSort(fieldName, sortDirection) {
    const taskClone = [...tasks];
    taskClone.sort((entry1, entry2) => {
      if (sortDirection === "ascending") {
        return entry1[fieldName] < entry2[fieldName] ? -1 : 1;
      }
      return entry2[fieldName] < entry1[fieldName] ? -1 : 1;
    });
    setSortState({ ...DEFAULT_STATE, [fieldName]: sortDirection });
    setAsanaTasks(taskClone);
  }

  return (
    <>
      {loading && (
        <LoadingSpinner size="sm" showLabel={true} label="🦄 Refreshing... " />
      )}

      {!loading && (
        <>
          <Button size="sm" onClick={getTasks}>
            Refresh
          </Button>
          <Table
            page={page}
            bordered={true}
            paginated={totalPages > 1}
            onPageChange={setPage}
            pageCount={totalPages}
          >
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Assigned to</TableHeader>
                <TableHeader
                  sortDirection={sortState.completed}
                  onSortChange={(sortDirection) =>
                    handleOnSort("completed", sortDirection)
                  }
                >
                  Status
                </TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedItems.map((task) => {
                const user = task.assignee ? getUser(task.assignee.gid) : null;
                return (
                  <TableRow width="min" key={task.gid}>
                    <TableCell>
                      <Task
                        name={task.gid}
                        // initialIsChecked={task.completed ? true : false}
                        completed={task.completed ? true : false}
                        taskValue={task.name}
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
                    <TableCell>
                      <Button size="extra-small" href={task.permalink_url}>
                        View in Asana
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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
