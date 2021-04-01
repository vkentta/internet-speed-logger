const checkInternetSpeed = require("./speedMeasurement");
const database = require("./database");

const MS_IN_MIN = 1000 * 60;
const CHECK_PERIOD_MINUTES = process.env.CHECK_PERIOD_MINUTES || 15;
const CHECK_PERIOD = MS_IN_MIN * CHECK_PERIOD_MINUTES;

function checkAndLogInternetSpeedPeriodically() {
    writeIntervalToConsole(CHECK_PERIOD_MINUTES);
    checkAndLogInternetSpeed();
    setInterval(checkAndLogInternetSpeed, CHECK_PERIOD);
}

async function checkAndLogInternetSpeed() {
    try {
        const speedTestResult = await checkInternetSpeed();
        writeLogToConsole(speedTestResult);
        database.addSpeedMeasurement(
            speedTestResult.package,
            speedTestResult.speed.downloadMbps,
            speedTestResult.speed.uploadMbps
        );
    } catch (error) {
        console.error(error);
    }
}

function writeIntervalToConsole(interval) {
    console.log(`Checking internet speed on ${interval} minute interval...`);
    console.log("--------------------------------------------------");
}

function writeLogToConsole(speedTestResult) {
    console.log(new Date().toISOString());
    console.log(`package: ${speedTestResult.package}`);
    console.log(
        `DL: ${speedTestResult.speed.downloadMbps} Mb/s, UL: ${speedTestResult.speed.uploadMbps} Mb/s`
    );
    console.log("--------------------------------------------------");
}

module.exports = checkAndLogInternetSpeedPeriodically;
