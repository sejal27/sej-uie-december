const axios = require("axios");

const { ASANA_PAT } = process.env;

exports.main = async (context = {}) => {
  const { ASANA_PROJECT_GID, ASANA_TEAM_GID } = context.parameters;
  console.log("IDs", ASANA_PROJECT_GID, ASANA_TEAM_GID);

  console.log("inside serverless function getAsanaTasks");

  try {
    // const users = await axios.get(
    //   `https://app.asana.com/api/1.0/teams/${ASANA_TEAM_GID}/users`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${ASANA_PAT}`,
    //     },
    //   }
    // );
    // console.log("users", users.data.data);

    const tasks = await axios.get(
      `https://app.asana.com/api/1.0/projects/${ASANA_PROJECT_GID}/tasks?opt_fields=name,assignee,completed,due_on`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ASANA_PAT}`,
        },
      }
    );

    console.log("tasks", tasks);
    return users;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};
