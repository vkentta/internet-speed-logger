(() => {
    const conf = {
        LOG_DIR_NAME: 'speedtest-logs',
        LOG_FILE_LIST_FILE_NAME: 'log-files.json'
    };
    try {
        module.exports = conf;
    } catch(err) {
        window.speedTestLogger = {
            getConf: () => conf
        };
    }
})();