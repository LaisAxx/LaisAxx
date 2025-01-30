const axios = require("axios");

async function fetchAllTimeStats(WAKATIME_API_KEY) {
  try {
    const response = await axios.get("https://wakatime.com/api/v1/users/current/stats", {
      headers: { Authorization: `Basic ${Buffer.from(WAKATIME_API_KEY).toString("base64")}` },
    });

    const totalTime = response.data.data.human_readable_total;
    const languages = response.data.data.languages;

    return { totalTime, languages };
  } catch (error) {
    console.error("Erro ao buscar dados do WakaTime:", error);
    return null;
  }
}

module.exports = fetchAllTimeStats;

