const axios = require("axios");
exports.main = async (context = {}) => {
  const { ASANA_PAT } = process.env;
  const { ASANA_PROJECT_GID } = context.parameters;

  console.log("inside serverless function getAsanaTasks");

  try {
    const response = await axios.get(
      `https://app.asana.com/api/1.0/projects/${ASANA_PROJECT_GID}/tasks?opt_fields=name,assignee,completed,due_on,permalink_url`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ASANA_PAT}`,
        },
      }
    );

    // console.log("tasks", tasks.data.data);
    const tasks = response.data.data;
    tasks.sort((a, b) => {
      return a.completed - b.completed;
    });

    return tasks;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};
