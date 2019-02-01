# internet-speed-logger
Run internet speed tests periodically.
The tests are run every 15 minutes, using [speedtest-net](https://www.npmjs.com/package/speedtest-net) and [fast-speedtest-api](https://www.npmjs.com/package/fast-speedtest-api) npm packages (taking turns between packages). The results are stored as json locally and can be displayed with included html-file.

### Requirements:
Node.js

### Running:
``npm install``

``npm start``

### Displaying speed test results:
After the speed tests have been running for a while, open ``index.html`` in your favourite browser.

