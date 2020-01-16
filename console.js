function writeLogToConsole(speedTestResult) {
  console.log((new Date()).toISOString());
  console.log(`package: ${speedTestResult.package}`);
  console.log(
    `DL: ${speedTestResult.speed.downloadMbps} Mb/s, UL: ${speedTestResult.speed.uploadMbps} Mb/s`
  );
  console.log("--------------------------------------------------");
}

module.exports = writeLogToConsole;
