const checkInternetSpeed = require("./speedMeasurement");
const writeLogToConsole = require("./console");
const database = require("./database");
const startServer = require("./server");

const MS_IN_MIN = 1000 * 60;
const CHECK_PERIOD = MS_IN_MIN * 15;

database.createTables();

startServer();
checkAndLogInternetSpeedPeriodically();

function checkAndLogInternetSpeedPeriodically() {
  checkAndLogInternetSpeed();
  setInterval(checkAndLogInternetSpeed, CHECK_PERIOD);
}

async function checkAndLogInternetSpeed() {
  const speedTestResult = await checkInternetSpeed();
  writeLogToConsole(speedTestResult);
  database.addSpeedMeasurement(
    speedTestResult.package,
    speedTestResult.speed.downloadMbps,
    speedTestResult.speed.uploadMbps
  );
}
