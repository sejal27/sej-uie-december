import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
  Link,
} from "@hubspot/ui-extensions";

import Task from "./Task.jsx";
import { min } from "date-fns";

const TasksTable = ({ tasks, users }) => {
  const getUserName = (gid) => {
    const user = users.find((user) => user.gid === gid);
    return user ? user.name : "Unknown";
  };
  console.log("tasks", tasks);
  console.log("users", users);
  return (
    // <>
    //   {tasks.map((task) => (
    //     <Task
    //       name={task.gid}
    //       initialIsChecked={Task.complete ? true : false}
    //       taskValue={<Link href={task.permalink_url}>{task.name}</Link>}
    //     />
    //   ))}
    // </>
    <Table>
      {/* <TableHead>
        <TableRow>
          <TableHeader>Task Name</TableHeader>
          <TableHeader>Assignee</TableHeader>
          <TableHeader>Status</TableHeader>
        </TableRow>
      </TableHead> */}
      <TableBody>
        {tasks.map((task) => (
          <TableRow width="min" key={task.gid}>
            <TableCell>
              <Task
                name={task.gid}
                initialIsChecked={Task.complete ? true : false}
                taskValue={<Link href={task.permalink_url}>{task.name}</Link>}
              />
            </TableCell>
            <TableCell>
              {task.assignee ? getUserName(task.assignee.gid) : "None"}
            </TableCell>
            <TableCell>
              <Tag variant={task.completed ? "success" : "warning"}>
                {task.completed ? "Complete" : "Incomplete"}
              </Tag>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TasksTable;
