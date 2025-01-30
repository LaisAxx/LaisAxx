const fs = require("fs");
const axios = require("axios");
const execSync = require("child_process").execSync;

const WAKATIME_API_KEY = process.env.WAKATIME_API_KEY;
const GITHUB_README_PATH = "README.md";

async function fetchAllTimeStats() {
  try {
    const response = await axios.get("https://wakatime.com/api/v1/users/current/stats", {
      headers: { Authorization: `Basic ${Buffer.from(WAKATIME_API_KEY).toString("base64")}` },
    });

    const totalTime = response.data.data.human_readable_total;
    const languages = response.data.data.languages;

    const languageStats = languages
      .map(lang => `- ${lang.name}: ${lang.text}`)
      .join("\n");

    return `## 📊 Coding Time (All Time)\nTotal: ${totalTime}\n\n### Most Used Languages\n${languageStats}\n`;
  } catch (error) {
    console.error("Erro ao buscar dados do WakaTime:", error);
    return "Erro ao carregar dados do WakaTime.";
  }
}

async function updateReadme() {
  const stats = await fetchAllTimeStats();
  let readmeContent = fs.readFileSync(GITHUB_README_PATH, "utf-8");

  const updatedContent = readmeContent.replace(
    /## 📊 Coding Time \(All Time\)[\s\S]*?(?=\n##|$)/,
    stats
  );

  console.log(updatedContent); 

  fs.writeFileSync(GITHUB_README_PATH, updatedContent);
  console.log("README updated!");

  execSync("git add README.md");
  execSync('git commit -m "Atualizando README com tempo de codificação"');
  execSync("git push origin main");
}

updateReadme();
