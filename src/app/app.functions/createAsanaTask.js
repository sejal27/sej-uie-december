const axios = require("axios");

exports.main = async (context = {}) => {
  const { ASANA_PAT } = process.env;
  const { project_gid, taskName, taskNotes, taskAssignee } = context.parameters;
  const { hs_object_id } = context.propertiesToSend;
  console.log("inside asana create task function");
  const asanaTaskTag = "[hs_" + hs_object_id + "]";

  try {
    const task = await axios.post(
      "https://app.asana.com/api/1.0/tasks",
      {
        data: {
          name: `${taskName} ${asanaTaskTag}`,
          completed: false,
          notes: taskNotes,
          assignee: taskAssignee,
          projects: [project_gid],
        },
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${ASANA_PAT}`,
        },
        params: { opt_fields: "name,assignee,due_on,notes,projects" },
      }
    );
    console.log("response", task.data);
    return task.data;
  } catch (error) {
    console.error(error);
  }
};
