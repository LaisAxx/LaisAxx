const fs = require("fs");
const fetchAllTimeStats = require("./fetchStats");
const generateRadialGaugeUrl = require("./generateCharts");

async function updateReadme() {
  const stats = await fetchAllTimeStats(process.env.WAKATIME_API_KEY);

  if (!stats) {
    console.log("Não foi possível carregar os dados do WakaTime.");
    return;
  }

  try {
    let readmeContent = fs.readFileSync("README.md", "utf-8");
    const languageChartUrls = await Promise.all(
      stats.languages.slice(0, 50).map(async (language) => {
        const time = language.total_seconds / 3600;
        const sampleSize = language.sample_size || 100; // Atribuindo valor padrão
        const url = await generateRadialGaugeUrl(language.name, time, sampleSize);
        return `### ${language.name}\n![${language.name} Time](${url})\n`;
      })
    );

    const updatedStats = `## 📊 Coding Time (All Time)\nTotal: ${stats.totalTime}\n\n### Most Used Languages\n${languageChartUrls.join("\n")}`;

    const updatedContent = readmeContent.replace(
      /## 📊 Coding Time \(All Time\)[\s\S]*/,
      updatedStats
    );


    fs.writeFileSync("README.md", updatedContent);
    console.log("README updated!");

  } catch (error) {
    console.error("Erro ao ler o arquivo README.md:", error);
    return;
  }
}

updateReadme();
