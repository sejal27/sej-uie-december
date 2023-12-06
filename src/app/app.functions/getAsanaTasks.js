const axios = require("axios");
const asana = require("asana");

// Make sure you have added these as secrets in your account using `hs secrets add`
const { ASANA_PAT, ASANA_WS_GID, ASANA_CUSTOM_FIELD } = process.env;
const asanaClient = asana.Client.create().useAccessToken(ASANA_PAT);

exports.main = async (context = {}) => {
  const { hs_object_id } = context.propertiesToSend;
  const asanaTaskTag = "hs_" + hs_object_id;

  try {
    const tasks = await getTasks(asanaTaskTag);
    return tasks;
  } catch (error) {
    return error;
  }
};

// ================== vvvv  Helper functions  vvvv =====================

// Get Asana tasks for the workspace and the team. Make sure you created a global custom field, added to the project, as well as added ASANA_CUSTOM_FIELD in your secrets and
async function getTasks(hs_contact_id) {
  const tasks = asanaClient.tasks.searchTasksForWorkspace(ASANA_WS_GID, {
    [`custom_fields.${ASANA_CUSTOM_FIELD}.value`]: hs_contact_id,
    opt_fields: "name,permalink_url,due_on,notes,assignee.name,completed",
  });
  return tasks;
}
