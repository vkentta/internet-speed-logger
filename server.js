const http = require("http");
const url = require("url");
const fs = require("fs");
const database = require("./database");

function startServer() {
  http
    .createServer(async (req, res) => {
      const reqUrl = url.parse(req.url, true);
      if (reqUrl.pathname === "/speeds") {
        const query = reqUrl.query;
        const measurements = await database.getSpeedMeasurements(
          query.start,
          query.end
        );

        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(measurements));
        res.end();
      } else if (reqUrl.pathname === "/") {
        fs.readFile("./index.html", function(error, content) {
          if (error) {
            console.log(error);
            res.writeHead(500, { "Content-Type": "text/html" });
            res.write("500 :(");
          } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(content, "utf-8");
          }
          res.end();
        });
      } else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.write("404 :(");
        res.end();
      }
    })
    .listen(3000);
}

module.exports = startServer;
