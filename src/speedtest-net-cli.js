const util = require("util");
const exec = util.promisify(require("child_process").exec);

module.exports = async function checkSpeedTestNetCLI(createTimestampedResult) {
  const { stdout, stderr } = await exec(
    "speedtest --accept-license --accept-gdpr -f json"
  );
  if (stdout) {
    const speedtestResult = JSON.parse(stdout);
    return createTimestampedResult({
      package: "speedtest-net-cli",
      downloadMbps: BtoMbit(speedtestResult.download.bandwidth),
      uploadMbps: BtoMbit(speedtestResult.upload.bandwidth)
    });
  }
  if (stderr) {
    throw new Error("speedtest-net-cli error:", stderr);
  }
};

function BtoMbit(Bytes) {
  return (Bytes * 8) / 1000000;
}
