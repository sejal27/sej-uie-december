const axios = require("axios");
const asana = require("asana");

// Make sure you have added these as secrets in your account using `hs secrets add`
const { ASANA_PAT, ASANA_TEAM_GID } = process.env;
const asanaClient = asana.Client.create().useAccessToken(ASANA_PAT);

exports.main = async (context = {}) => {
  try {
    const team = await asanaClient.teams.getTeam(ASANA_TEAM_GID);
    return team;
  } catch (error) {
    return error;
  }
};
