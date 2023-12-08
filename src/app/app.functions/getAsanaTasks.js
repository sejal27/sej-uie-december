const axios = require("axios");
exports.main = async (context = {}) => {
  const { ASANA_PAT } = process.env;
  const { ASANA_PROJECT_GID } = context.parameters;

  console.log("inside serverless function getAsanaTasks");

  try {
    const tasks = await axios.get(
      `https://app.asana.com/api/1.0/projects/${ASANA_PROJECT_GID}/tasks?opt_fields=name,assignee,completed,due_on,permalink_url`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ASANA_PAT}`,
        },
      }
    );

    // console.log("tasks", tasks.data.data);
    return tasks.data.data;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};
