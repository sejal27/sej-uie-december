const axios = require("axios");

// Make sure you have added these as secrets in your account using `hs secrets add`

exports.main = async (context = {}) => {
  const { ASANA_PAT } = process.env;
  const { ASANA_TEAM_GID } = context.parameters;

  try {
    const users = await axios.get(
      `https://app.asana.com/api/1.0/teams/${ASANA_TEAM_GID}/users?opt_fields=name,photo.image_21x21,`,
      {
        headers: {
          Authorization: `Bearer ${ASANA_PAT}`,
        },
      }
    );
    // console.log("users", users.data.data);
    return users.data;
  } catch (error) {
    return error;
  }
};
