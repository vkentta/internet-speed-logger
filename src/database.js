const sqlite3 = require("sqlite3").verbose();
const DB = new sqlite3.Database("./data/speedMeasurements.database");

function createTables() {
  DB.run(
    `CREATE TABLE IF NOT EXISTS speed_measurement (
      id INTEGER PRIMARY KEY,
      package TEXT,
      download_Mbps INTEGER DEFAULT 0,
      upload_Mbps INTEGER DEFAULT 0,
      date_time INTEGER
    );
    `,
    error => {
      logError(error);
      if (!!error) {
        throw error;
      }
    }
  );
}

function addSpeedMeasurement(package, downloadMbps, uploadMbps) {
  addSpeedMeasurementWithDateTime(
    package,
    downloadMbps,
    uploadMbps,
    Date.now()
  );
}

function addSpeedMeasurementWithDateTime(
  package,
  downloadMbps,
  uploadMbps,
  dateTime
) {
  const dateTimeMs = new Date(dateTime).getTime();

  DB.run(
    `
    INSERT INTO speed_measurement (package, download_Mbps, upload_Mbps, date_time)
    VALUES ($package, $downloadMbps, $uploadMbps, $dateTimeMs);
    `,
    {
      $package: package,
      $downloadMbps: downloadMbps,
      $uploadMbps: uploadMbps,
      $dateTimeMs: dateTimeMs
    },
    error => {
      logError(error);
    }
  );
}

function getSpeedMeasurements(startDateTime, endDateTime) {
  const startDateMs = !isNaN(startDateTime)
    ? new Date(Number(startDateTime)).getTime()
    : 0;
  const endDateMs = !isNaN(endDateTime)
    ? new Date(Number(endDateTime)).getTime()
    : Date.now();

  return new Promise((resolve, reject) => {
    DB.all(
      `
      SELECT * 
      FROM speed_measurement
      WHERE $startDateMs <= date_time AND date_time <= $endDateMs;
      `,
      {
        $startDateMs: startDateMs,
        $endDateMs: endDateMs
      },
      function returnResults(error, results) {
        if (!!results) {
          resolve(results);
        } else if (!error) {
          error = "getSpeedMeasurements: Something unexpected happened";
        }
        logError(error);
        reject(error);
      }
    );
  });
}

function logError(error) {
  if (!!error) {
    console.log(error);
  }
}

module.exports = {
  createTables,
  addSpeedMeasurementWithDateTime,
  addSpeedMeasurement,
  getSpeedMeasurements
};
