const fs = require("fs");
const fetchAllTimeStats = require("./fetchStats");

async function updateReadme() {
  const stats = await fetchAllTimeStats(process.env.WAKATIME_API_KEY);

  if (!stats) {
    console.log("Não foi possível carregar os dados do WakaTime.");
    return;
  }

  try {
    function formatTime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      return `${hours}h ${minutes}m ${secs}s`;
    }
    const languageData = stats.languages.map(lang => ({
      name: lang.name,
      total_seconds: lang.total_seconds,
      formattedTime: formatTime(lang.total_seconds)
    }));

    let filteredLanguages = languageData.filter(lang => lang.total_seconds >= 3600);

    filteredLanguages.sort((a, b) => b.total_seconds - a.total_seconds);

    const maxLanguages = 5;
    const mainLanguages = filteredLanguages.slice(0, maxLanguages);
    const otherLanguages = filteredLanguages.slice(maxLanguages);
    const otherTotal = otherLanguages.reduce((sum, lang) => sum + lang.total_seconds, 0);

    if (otherTotal > 0) {
      mainLanguages.push({ name: "Outros", total_seconds: otherTotal, formattedTime: formatTime(otherTotal) });
    }

    const totalHours = mainLanguages.reduce((sum, lang) => sum + lang.total_seconds, 0);

    const labels = mainLanguages.map(lang => {
      const percentage = ((lang.total_seconds / totalHours) * 100).toFixed(1); 
      return `${lang.name} (${percentage}%) (${lang.formattedTime})`; 
    });

    const times = mainLanguages.map(lang => ((lang.total_seconds / totalHours) * 100).toFixed(1));

    const backgroundColors = [
      "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
      "#FF9F40", "#C9CBCF", "#66FF66", "#FF99CC", "#0099CC"
    ];

    const chartData = {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: times,
            backgroundColor: backgroundColors.slice(0, labels.length),
            label: "Uso de Linguagens (%)"
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            position: "right", 
            labels: {
              font: {
                size: 14
              }
            }
          },
          datalabels: {
            display: true,
            formatter: (value, context) => {
              const percentage = value.toFixed(1); 
              return `${percentage}%`;
            },
            color: "#fff",
            font: {
              size: 10,
              weight: "bold"
            },
            align: 'center',
            padding: 5
          }
        }
      }
    };


    const doughnutChartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartData))}`;

    // README
    let readmeContent = fs.readFileSync("README.md", "utf-8");
    const updatedStats = `## 📊 Coding Time (All Time)\nTotal: **${formatTime(totalHours)}**\n\n### Most Used Languages\n![Languages Time](${doughnutChartUrl})\n\n`;

    const updatedContent = readmeContent.replace(/## 📊 Coding Time \(All Time\)[\s\S]*/, updatedStats);

    fs.writeFileSync("README.md", updatedContent);
    console.log("README updated!");

  } catch (error) {
    console.error("Erro ao ler o arquivo README.md:", error);
  }
}

updateReadme();