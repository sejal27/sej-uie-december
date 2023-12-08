const axios = require("axios");

// Make sure you have added these as secrets in your account using `hs secrets add`

exports.main = async (context = {}) => {
  const { ASANA_PAT } = process.env;
  const { GID, completed } = context.parameters;

  try {
    const resp = await axios.put(
      `https://app.asana.com/api/1.0/tasks/${GID}/`,
      { data: { completed: `${completed}` } },
      {
        headers: {
          Authorization: `Bearer ${ASANA_PAT}`,
        },
      }
    );
    // console.log(resp.status);
    return resp.status;
  } catch (error) {
    console.error(error);
    return error;
  }
};
