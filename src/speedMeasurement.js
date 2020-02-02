const checkSpeedTestNetCLI = require("./speedtest-net-cli");
const checkFastCom = require("./fast-speedtest-api");

const testFunctions = [
  () => checkSpeedTestNetCLI(createTimestampedResult),
  () => checkFastCom(createTimestampedResult)
];
let testRound = 0;

module.exports = async function checkInternetSpeed() {
  const testFunction = testFunctions[testRound % testFunctions.length];
  testRound++;
  return await testFunction();
};

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
