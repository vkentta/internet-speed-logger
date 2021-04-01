const database = require("./src/database");
const startServer = require("./src/server");
const checkAndLogInternetSpeedPeriodically = require("./src/internet-speed-logger");

database.createTables();

startServer();
checkAndLogInternetSpeedPeriodically();
