const initialDateRange = getDateRangeFromQueryOrDefault();

updateDatePickerDOMWithDate("date_range_start", initialDateRange.start);
updateDatePickerDOMWithDate("date_range_end", initialDateRange.end);
document
    .getElementById("fetch_logs_button")
    .addEventListener("click", fecthAndDrawLogWithInputValues);

const start = datepicker("#date_range_start", {
    id: 1,
    startDay: 1,
    dateSelected: initialDateRange.start,
    onSelect: instance =>
        updateDatePickerDOMWithDate("date_range_start", instance.dateSelected)
});
const end = datepicker("#date_range_end", {
    id: 1,
    startDay: 1,
    dateSelected: initialDateRange.end,
    onSelect: instance =>
        updateDatePickerDOMWithDate("date_range_end", instance.dateSelected),
    position: "br"
});

fecthAndDrawLog(initialDateRange);

function fecthAndDrawLogWithInputValues() {
    const dateRange = start.getRange();
    location.search = `?start=${dateToISOStringDate(
        dateRange.start
    )}&end=${dateToISOStringDate(dateRange.end)}`;
}

function updateDatePickerDOMWithDate(pickerId, date) {
    document.getElementById(pickerId).innerText = dateToISOStringDate(date);
}

function getDateRangeFromQueryOrDefault() {
    let todayStart = new Date();
    todayStart.setHours(0);
    todayStart.setMinutes(0);
    todayStart.setSeconds(0);
    let dateRange = {
        start: todayStart,
        end: new Date()
    };
    const queryParameters = location.search.split("?")[1];
    if (queryParameters) {
        const queryParameterKeyValueStringArray = queryParameters.split("&");
        queryParameterKeyValueStringArray.forEach(keyValueString => {
            const keyAndValue = keyValueString.split("=");
            if (
                keyAndValue[0] === "start" &&
                !isNaN(new Date(keyAndValue[1]).getTime())
            ) {
                dateRange.start = new Date(keyAndValue[1]);
            } else if (
                keyAndValue[0] === "end" &&
                !isNaN(new Date(keyAndValue[1]).getTime())
            ) {
                dateRange.end = new Date(keyAndValue[1]);
            }
        });
    }
    if (dateRange.end < dateRange.start) {
        const temp = dateRange.start;
        dateRange.start = dateRange.end;
        dateRange.end = temp;
    }
    return dateRange;
}

function dateToISOStringDate(originalDate) {
    const date = new Date(originalDate.getFullYear() + '-' + (originalDate.getMonth() + 1) + '-' + originalDate.getDate());
    return date.toISOString().split('T')[0];
}

function fecthAndDrawLog(dateRange) {
    const msStart = getMinimumMillisecondsForDate(dateRange.start);
    const msEnd = getMaximumMillisecondsForDate(dateRange.end);
    fetch(`/speeds?start=${msStart}&end=${msEnd}`)
        .then(data => data.json())
        .then(results => drawGraph(results));
}

function getMinimumMillisecondsForDate(date) {
    let dateMin = new Date(date.getTime());
    dateMin.setHours(0);
    dateMin.setMinutes(0);
    dateMin.setSeconds(0);
    dateMin.setMilliseconds(0);
    return dateMin.getTime();
}

function getMaximumMillisecondsForDate(date) {
    let dateMax = new Date(getMinimumMillisecondsForDate(date));
    dateMax.setDate(dateMax.getDate() + 1);
    dateMax.setMilliseconds(-1);
    return dateMax.getTime();
}

function drawGraph(results) {
    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chart(ctx, {
        type: "line",
        data: {
            datasets: getDatasets(results)
        },
        options: {
            scales: {
                xAxes: [
                    {
                        type: "time",
                        time: {
                            unit: "day",
                            isoWeekday: true
                        }
                    }
                ]
            }
        }
    });
}

function getDatasets(results) {
    const fastComResults = results.filter(
        result => result.package === "fast-speedtest-api"
    );
    const speedtestNetResults = results.filter(
        result => result.package === "speedtest-net-cli"
    );

    const combinedDatapointsCount = 40;

    if (combinedDatapointsCount * 2 < results.length) {
        return datasetBasesWithData(
            combineAverageResults(fastComResults, combinedDatapointsCount).map(
                resultToDownloadDatapoint
            ),
            combineAverageResults(
                speedtestNetResults,
                combinedDatapointsCount
            ).map(resultToDownloadDatapoint),
            combineAverageResults(
                speedtestNetResults,
                combinedDatapointsCount
            ).map(resultToUploadDatapoint)
        );
    } else {
        return datasetBasesWithData(
            fastComResults.map(resultToDownloadDatapoint),
            speedtestNetResults.map(resultToDownloadDatapoint),
            speedtestNetResults.map(resultToUploadDatapoint)
        );
    }
}

function datasetBasesWithData(
    fastDownload,
    speedtestDownload,
    speedtestUpload
) {
    return [
        {
            label: "fast.com download (Mb/s)",
            borderColor: "#101804",
            data: fastDownload,
            fill: false
        },
        {
            label: "speedtest.net download (Mb/s)",
            borderColor: "#808c9e",
            data: speedtestDownload,
            fill: false
        },
        {
            label: "speedtest.net upload (Mb/s)",
            borderColor: "#c48430",
            data: speedtestUpload,
            fill: false
        }
    ];
}

function resultToDownloadDatapoint(result) {
    return { x: new Date(result.date_time), y: result.download_Mbps };
}

function resultToUploadDatapoint(result) {
    return { x: new Date(result.date_time), y: result.upload_Mbps };
}

function combineAverageResults(results, combinedDatapointsCount) {
    const combineBlockSize = Math.floor(
        results.length / combinedDatapointsCount
    );
    return recursiveCombineAverageResults(
        results,
        [],
        results.length,
        combineBlockSize
    );
}

function recursiveCombineAverageResults(
    results,
    blocks,
    blockExclusiveEndIndex,
    blockSize
) {
    if (blockSize <= blockExclusiveEndIndex) {
        const block = results.slice(
            blockExclusiveEndIndex - blockSize,
            blockExclusiveEndIndex
        );
        const blockCombinedResult = block.reduce(
            (accumulator, current) => ({
                date_combined: accumulator.date_combined + current.date_time,
                download_combined:
                    accumulator.download_combined + current.download_Mbps,
                upload_combined: accumulator.upload_combined + current.upload_Mbps
            }),
            { date_combined: 0, download_combined: 0, upload_combined: 0 }
        );
        const blockAverageResult = {
            date_time: blockCombinedResult.date_combined / blockSize,
            download_Mbps: Math.round(
                blockCombinedResult.download_combined / blockSize
            ),
            upload_Mbps: Math.round(
                blockCombinedResult.upload_combined / blockSize
            )
        };
        return recursiveCombineAverageResults(
            results,
            blocks.concat([blockAverageResult]),
            blockExclusiveEndIndex - blockSize,
            blockSize
        );
    } else {
        return blocks;
    }
}
