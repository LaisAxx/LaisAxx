const generateRadialGaugeUrl = async (language, time, sampleSize) => {
    console.log(`Generating radial gauge for ${language} with time: ${time}, sampleSize: ${sampleSize}`);

    if (typeof time === 'undefined' || isNaN(time)) {
        console.error('Invalid or undefined "time" value');
        return null; 
    }

    if (typeof sampleSize === 'undefined' || isNaN(sampleSize) || sampleSize <= 0) {
        console.error('Invalid or undefined "sampleSize" value');
        return null; 
    }

    const chartData = {
        type: 'radialGauge',
        data: {
            datasets: [
                {
                    data: [time], 
                    backgroundColor: ['#4e73df'], 
                    borderWidth: 10,
                    circumference: 180,
                    rotation: -90,
                    borderColor: '#000',
                }
            ],
        },
        options: {
            plugins: {
                tooltip: {
                    enabled: false,
                },
            },
            scale: {
                min: 0,
                max: 300,
                stepSize: 50,
            },
            rotation: Math.PI,
            circumference: Math.PI,
        },
    };

    const quickChartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartData))}`;
    console.log(quickChartUrl);
    return quickChartUrl;
}

module.exports = generateRadialGaugeUrl;
