const fs = require('fs-extra');
const path = require('path');

const conf = require('./conf');
const checkInternetSpeed = require('./speedMeasurement');

const MS_IN_MIN = 1000 * 60;
const CHECK_PERIOD = MS_IN_MIN * 15;

checkAndLogInternetSpeedPeriodically();

function checkAndLogInternetSpeedPeriodically() {
    checkAndLogInternetSpeed();

    setInterval(checkAndLogInternetSpeed, CHECK_PERIOD);
}

async function checkAndLogInternetSpeed() {
    const speedTestResult = await checkInternetSpeed();

    writeLogToConsole(speedTestResult);
    await ensureLogDirAndWriteLogToFile(speedTestResult);
    createLogFilePathListFile();
}

async function ensureLogDirAndWriteLogToFile(speedTestResult) {
    await ensureLogDirectoryExists();
    await writeLogToFile(speedTestResult);
}

async function ensureLogDirectoryExists() {
    try {
        await fs.readdir(conf.LOG_DIR_NAME);
    } catch(err) {
        if (err.code === 'ENOENT') {
            await createLogDirectory();
        }
    }
}

async function createLogDirectory() {
    console.log(`Creating directory: ${conf.LOG_DIR_NAME}`);
    printSeparatorLineToConsole();

    try {
        await fs.mkdir(conf.LOG_DIR_NAME);
    } catch(err) {
        console.error(err);
    }
}

async function writeLogToFile(speedTestResult) {
    const currentYear = speedTestResult.date.getFullYear().toString();
    const monthNumber = speedTestResult.date.getMonth() + 1;
    const leftPadMonthNumber = `0${monthNumber}`.slice(-2);
    const fileName = `${speedTestResult.package}-${currentYear}-${leftPadMonthNumber}.json`;
    const filePath = path.join(conf.LOG_DIR_NAME, fileName);
    
    let fileContent = await readFromExistingFile(filePath);
    fileContent.push(createSpeedTestResultItemWithISODate(speedTestResult));
    
    const fileContentString = JSON.stringify(fileContent);
    try {
        await fs.writeFile(filePath, fileContentString);
    } catch(err) {
        console.error(err);
    }
}

async function readFromExistingFile(filePath) {
    let fileContent;

    try {
        const data = await fs.readFile(filePath);
        fileContent = JSON.parse(data.toString());
    } catch(err) {
        console.log(`Creating new file: ${filePath}`);
        printSeparatorLineToConsole();

        fileContent = [];
    }

    return fileContent;
}

function createSpeedTestResultItemWithISODate(speedTestResult) {
    return {
        ...speedTestResult,
        date: speedTestResult.date.toISOString(),
    };
}

async function createLogFilePathListFile() {
    const listFilePath = path.join(conf.LOG_DIR_NAME, conf.LOG_FILE_LIST_FILE_NAME);
    const fileListArray = await getFileListArray();
    const fileContentString = JSON.stringify(fileListArray);

    try {
        await fs.writeFile(listFilePath, fileContentString);
    } catch(err) {
        console.error(err);
    }
}

async function getFileListArray() {
    const logDirItems = await fs.readdir(conf.LOG_DIR_NAME);
    const logFiles = logDirItems.filter(item => item !== conf.LOG_FILE_LIST_FILE_NAME);
    
    return logFiles;
}

function writeLogToConsole(speedTestResult) {
    console.log(`package: ${speedTestResult.package}`);
    console.log(`DL: ${speedTestResult.speed.downloadMbps} Mb/s, UL: ${speedTestResult.speed.uploadMbps} Mb/s`);
    printSeparatorLineToConsole();
}

function printSeparatorLineToConsole() {
    console.log('--------------------------------------------------');
}
