const FastSpeedtest = require("fast-speedtest-api");

const MS_IN_MIN = 1000 * 60;
const MAX_SPEEDTEST_DURATION_MS = MS_IN_MIN / 2;

module.exports = async function checkFastCom(createTimestampedResult) {
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
};
