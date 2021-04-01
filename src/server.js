const http = require("http");
const url = require("url");
const fs = require("fs");
const database = require("./database");

module.exports = function startServer() {
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
        respondWithFileInPath(res, "./ui/index.html", "text/html");
      } else if (reqUrl.pathname === "/ui.js") {
        respondWithFileInPath(res, "./ui/ui.js", "application/javascript");
      } else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.write("404 :(");
        res.end();
      }
    })
    .listen(3000);
};

function respondWithFileInPath(response, path, contentType) {
  fs.readFile(path, function(error, content) {
    if (error) {
      console.log(error);
      response.writeHead(500, { "Content-Type": "text/html" });
      response.write("500 :(");
    } else {
      response.writeHead(200, { "Content-Type": contentType });
      response.write(content, "utf-8");
    }
    response.end();
  });
}