const fs = require("fs");
const axios = require("axios");

const WAKATIME_API_KEY = process.env.WAKATIME_API_KEY; 
const GITHUB_README_PATH = "README.md"; 

async function fetchWakaTimeStats() {
  try {
    const response = await axios.get("https://wakatime.com/api/v1/users/current/stats/last_7_days", {
      headers: { Authorization: `Basic ${Buffer.from(WAKATIME_API_KEY).toString("base64")}` },
    });

    const languages = response.data.data.languages
      .map((lang) => `- ${lang.name}: ${lang.text}`)
      .join("\n");

    return `## 📊 Tempo de Codificação (últimos 7 dias)\n${languages}\n`;
  } catch (error) {
    console.error("Erro ao buscar dados do WakaTime:", error);
    return "Erro ao carregar dados do WakaTime.";
  }
}

async function updateReadme() {
  const stats = await fetchWakaTimeStats();
  let readmeContent = fs.readFileSync(GITHUB_README_PATH, "utf-8");

  // Substitui a seção de estatísticas no README
  const updatedContent = readmeContent.replace(
    /## 📊 Tempo de Codificação \(últimos 7 dias\)[\s\S]*?(?=\n##|$)/,
    stats
  );

  fs.writeFileSync(GITHUB_README_PATH, updatedContent);
  console.log("README atualizado!");
}

updateReadme();
