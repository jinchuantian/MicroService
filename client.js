var net = require("net");
var readline = require("readline");
console.log(
  "type url:rolename or wiki:rolename to get the url, such as url:Alyss or wiki:Alyss"
);
console.log('type "exit" or "quit" to quit.');

// sock is an instance of net.Socket
var sock = net.connect({ port: 3361 }, function () {
  // connect ser
  console.log("micro server connected");
  sock.setEncoding("utf8");
  //sock.write('Hello Micro Server\r\n');
});

sock.on("data", function (data) {
  console.log("got data from micro server - ", data);
});

sock.on("end", function () {
  console.log("client disconnected");
});

sock.on("error", function (err) {
  console.log("socket error - ", err);
});

sock.on("close", function () {
  console.log("micro client was closed");
  process.exit(0);
});

var rl = readline.createInterface({
  input: process.stdin,
});

function quitClient() {
  rl.close();
  sock.end();
  console.log("quit micro client");
}

rl.on("line", function (cmd) {
  if (cmd.indexOf("quit") == 0 || cmd.indexOf("exit") == 0) {
    quitClient();
  } else {
    var userInput = cmd.split(":");
    var req = {};
    if (userInput.length == 2) {
      req["type"] = userInput[0].trim();
      req["data"] = userInput[1].trim();
      // If you want to test returning wiki-type urls, uncomment it
      // req['type'] = 'wiki';
      var json = JSON.stringify(req);
      sock.write(json);
    } else {
      console.log("invalid input");
    }
  }
});

rl.on("SIGINT", quitClient);
