const axios = require("axios");

const { ASANA_PAT } = process.env;

exports.main = async (context = {}) => {
  const { ASANA_PROJECT_GID } = context.parameters;
  console.log("IDs", ASANA_PROJECT_GID);

  console.log("inside serverless function getAsanaTasks");

  let opts = { limit: 10, opt_fields: "gid,name,assignee,completed,due_on" };

  try {
    const resp = await axios.get(
      `https://app.asana.com/api/1.0/projects/${ASANA_PROJECT_GID}/tasks?opt_fields=name,assignee,completed,due_on`,
      {
        headers: {
          Authorization: `Bearer ${ASANA_PAT}`,
        },
      }
    );
    console.log("tasks", resp);

    const users = await asanaClient.users.getUsersForTeam(ASANA_TEAM_GID);
    console.log("users", users);
    const tasks = resp.data.data.map((task) => {
      return {
        name: task.name,
        assignee: task.assignee,
        completed: task.completed,
        due_on: task.due_on,
      };
    });
    console.log("tasks", tasks);
    return tasks;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};
