// require package
var net = require("net");
const fs = require("fs");

// server environment
var server = net.createServer();
var port = 3361;
var maxConnections = 10;
// socket wait time 1 minute
var waitTime = 60;

// const dataset = require('./config.json')
// read role-url file
var data = fs.readFileSync("./config.json", "utf8");

// parse JSON string to JSON object
var config = JSON.parse(data);
var con = config.data;

// Find the url of the corresponding role according to reqName, if not found, return not found.
function getUrl(reqName) {
  var url = "not found";
  for (var i = 0; i < con.length; i++) {
    // reqName.indexOf(con[i]['name']) == 0
    if (reqName == con[i]["name"]) {
      url = con[i]["url"];
    }
  }
  return url;
}

// socket connect
server.on("connection", function (sock) {
  console.log(
    "client connected, address -  ",
    sock.remoteAddress,
    " port - ",
    sock.remotePort
  );
  sock.setEncoding("utf8");

  // receive data function
  sock.on("data", function (reqdata) {
    // log the request data
    console.log("got data from client - ", reqdata);
    //if(reqdata.indexOf('not found') == 0)

    // parse request data
    var request = JSON.parse(reqdata);

    // the object which socket return
    var object = {};
    if (request["type"] == "wiki") {
      // return wiki url
      object["status"] = 200;
      object["url"] =
        "https://toweroffantasy.fandom.com/wiki/" +
        request["data"].replace(" ", "_");
    } else {
      // return youtube video url
      url = getUrl(request["data"]);
      object["url"] = url;
      if (url.indexOf("not found") == 0) {
        object["status"] = 400;
      } else {
        object["status"] = 200;
      }
    }
    // js object to json
    var json = JSON.stringify(object);
    sock.write(json);
  });

  // client disconnect function
  sock.on("end", function () {
    console.log("client disconnected");
  });

  // server find error
  sock.on("error", function (err) {
    console.log("socket error - ", err);
  });

  // set timeout
  sock.setTimeout(1000 * waitTime, function () {
    console.log(
      "Client has not communicated for" + waitTime + "s, will disconnect..."
    );
  });
  // When a timeout event is detected, the connection is disconnected
  sock.on("timeout", function () {
    sock.end();
  });
});

// set the max connections
server.maxConnections = maxConnections;
// start the server
server.listen(port, function () {
  console.log("Micro server running at port - " + port);
});
