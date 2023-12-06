const axios = require("axios");
const asana = require("asana");

// Make sure you have added these as secrets in your account using `hs secrets add`
const { ASANA_PAT, ASANA_TEAM_GID, ASANA_CUSTOM_FIELD } = process.env;
const asanaClient = asana.Client.create().useAccessToken(ASANA_PAT);

exports.main = async (context = {}) => {
  const { hs_object_id } = context.propertiesToSend;
  const asanaTaskTag = "hs_" + hs_object_id;
  const { name, notes, assignee, project } = context.parameters;

  try {
    const taskCreated = await asanaClient.tasks.createTask({
      name: name,
      notes: notes,
      projects: [project],
      assignee: assignee,
    });
    return taskCreated;
  } catch (error) {
    return error;
  }
};
