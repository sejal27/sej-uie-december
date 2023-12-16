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
  Text,
  Tag,
  Flex,
  Box,
  TableHeader,
  TableHead,
  Checkbox,
  ButtonRow,
  Form,
  Input,
  Select,
  DateInput,
  TextArea,
} from "@hubspot/ui-extensions";
import { Panel } from "@hubspot/ui-extensions/experimental";
import Task from "./components/Task.jsx";
import User from "./components/User.jsx";

// const ASANA_WS_GID = "8587152060687";
const ASANA_TEAM_GID = "1206118327825301";
const ASANA_PROJECT_GID = "1206117893165586";

const Asana = ({ context, runServerlss, fetchProperties }) => {
  const [page, setPage] = useState(1);
  const [tasks, setAsanaTasks] = useState([]);
  const [users, setTeamUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactName, setContactName] = useState(null);
  const [taskName, setTaskName] = useState(null);
  const [taskAssignee, setTaskAssignee] = useState(null);
  const [taskDueOn, setTaskDueOn] = useState(null);
  const [taskNotes, setTaskNotes] = useState(null);
  const [taskCreated, setTaskCreated] = useState(true);

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
      console.log(response);
      // return response;
    } catch (error) {
      console.error("Error updating task in Asana", error);
    }
  };

  const createAsanaTask = async (taskName, taskNotes, taskAssignee) => {
    try {
      const response = await runServerlss({
        name: "createAsanaTask",
        parameters: {
          taskName: taskName,
          taskNotes: taskNotes,
          taskAssignee: taskAssignee,
          project_gid: ASANA_PROJECT_GID,
        },
        propertiesToSend: ["hs_object_id"],
      });
      // console.log("Task created", response.response.data.name);
      return response.response.data.name;
    } catch (error) {
      console.error("Error in creating asana task: ", error);
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

  useEffect(() => {
    fetchProperties(["firstname"]).then(({ firstname }) => {
      setContactName(firstname);
    });
  });

  const CreateTaskPanel = () => {
    const Footer = () => {
      return (
        <>
          <Flex direction="row" justify="end">
            <Button
              variant="primary"
              onClick={() => createAsanaTask(taskName, taskAssignee, taskNotes)}
            >
              Create
            </Button>
          </Flex>
        </>
      );
    };

    const assignees = users.map((user) => {
      return { label: user.name, value: user.gid };
    });
    return (
      <>
        <Panel
          id="create-task-panel"
          title={`Add task for ${contactName}`}
          width="md"
          variant="modal"
          footer={<Footer />}
        >
          <Flex direction="column" gap="sm">
            <Input
              name="task-name"
              label="Task Name"
              value={taskName}
              onChange={setTaskName}
            />
            <Select
              name="task-assignee"
              label="Assignee"
              value={taskAssignee}
              options={assignees}
              onChange={setTaskAssignee}
            />
            {/* <DateInput
              name="due-on"
              label="Due On"
              value={taskDueOn}
              onChange={setTaskDueOn}
            /> */}
            <TextArea
              name="description"
              label="Task Description"
              value={taskNotes}
              onChange={setTaskNotes}
            />
          </Flex>
        </Panel>
      </>
    );
  };

  return (
    <>
      <CreateTaskPanel />
      {loading && (
        <LoadingSpinner
          size="sm"
          showLabel={true}
          label="🦄 Refreshing Tasks... "
        />
      )}
      <Flex gap="md" direction="column">
        {!loading && (
          <>
            <Flex direction="row" gap="md">
              <ButtonRow>
                <Button size="sm" onClick={getTasks}>
                  Refresh
                </Button>
                <Button
                  size="sm"
                  onClick={(__event, reactions) => {
                    reactions
                      .openPanel("create-task-panel")
                      .then(() => {
                        try {
                          reactions.closePanel("create-task-panel");
                        } catch (error) {
                          console.error("Error closing panel:", error);
                        }
                      })
                      .catch((error) => {
                        console.log("Error opening panel:", error);
                      });
                  }}
                >
                  Add Task
                </Button>
              </ButtonRow>

              <Checkbox name="show-incomplete">Show Incomplete</Checkbox>
            </Flex>
            <Box></Box>
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
                  const user = task.assignee
                    ? getUser(task.assignee.gid)
                    : null;
                  return (
                    <TableRow key={task.gid}>
                      <TableCell width="min">
                        <Task
                          name={task.gid}
                          // initialIsChecked={task.completed ? true : false}
                          completed={task.completed ? true : false}
                          taskValue={task.name}
                          onTaskChange={handleTaskChange}
                        />
                      </TableCell>

                      <TableCell width="min">
                        {user ? (
                          <User
                            name={user.name}
                            photo={user.photo ? user.photo.image_21x21 : null}
                          />
                        ) : (
                          "None"
                        )}
                      </TableCell>
                      <TableCell width="min">
                        <Tag variant={task.completed ? "success" : "warning"}>
                          {task.completed ? "Complete" : "Incomplete"}
                        </Tag>
                      </TableCell>
                      <TableCell width="min">
                        <Button size="extra-small" href={task.permalink_url}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </>
        )}
      </Flex>
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
