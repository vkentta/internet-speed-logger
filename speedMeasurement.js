const speedTest = require("speedtest-net");
const FastSpeedtest = require("fast-speedtest-api");

const MS_IN_MIN = 1000 * 60;
const MAX_SPEEDTEST_DURATION_MS = MS_IN_MIN / 2;

const testFunctions = [checkSpeedTestNet, checkFastCom];
let testRound = 0;

async function checkInternetSpeed() {
  const testFunction = testFunctions[testRound % testFunctions.length];
  testRound++;
  return await testFunction();
}

async function checkSpeedTestNet() {
  const test = speedTest({ maxTime: MAX_SPEEDTEST_DURATION_MS });
  const testPromise = new Promise(resolve => {
    test.on("data", data => {
      resolve(
        createTimestampedResult({
          package: "speedtest-net",
          downloadMbps: data.speeds.download,
          uploadMbps: data.speeds.upload
        })
      );
    });
  });

  return await testPromise;
}

async function checkFastCom() {
  const speedtest = new FastSpeedtest({
    token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
    timeout: MAX_SPEEDTEST_DURATION_MS,
    unit: FastSpeedtest.UNITS.Mbps
  });

  return createTimestampedResult({
    package: "fast-speedtest-api",
    downloadMbps: await speedtest.getSpeed(),
    uploadMbps: 0
  });
}

function createTimestampedResult(result) {
  return {
    date: new Date(),
    package: result.package,
    speed: {
      downloadMbps: result.downloadMbps,
      uploadMbps: result.uploadMbps
    }
  };
}

try {
  module.exports = checkInternetSpeed;
} catch (err) {
  console.error(err);
}
