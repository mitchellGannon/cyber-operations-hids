const fs = require("node:fs");
const express = require("express");
const bodyParser = require("body-parser");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { randomUUID } = require('crypto');

const app = express();
const server = createServer(app);
const io = new Server(server, { path: "/ids-server/" });

const intrusionsList = [];
var IPDict = {};

const IntrusionTypes = {
  SqlInjection: "Sql Injection",
  DOS: "Denial Of Service",
};

// read in the wordlist of sql injection strings
const sqlInjectionStrings = new Set(
  fs
    //.readFileSync("./wordlists/wordlist.txt")
    .readFileSync("wordlist.txt")
    .toString("UTF8")
    .split("\n")
);

function isSqlInjectionAttempt (username, password) {
  return sqlInjectionStrings.has(username) || sqlInjectionStrings.has(password);
}

function getRequestIP(req){
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress; 
}

function isDOSAttack(req) {
    const REQUESTS_TO_HOLD_NUMBER = 10;
    const MINIMUM_SECONDS_BETWEEN_REQUESTS = 20;
    const reqIP = getRequestIP(req);
    const timeOfRequest = new Date().getTime();

    var requestsArr = IPDict[reqIP];

    if(requestsArr === undefined){
        IPDict[reqIP] = [timeOfRequest];
        return false;
    }

    requestsArr.push(timeOfRequest);

    if (requestsArr.length < REQUESTS_TO_HOLD_NUMBER) return false;

    var totalTimeBetweenRequests = 0;
    var previousTime = null;

    requestsArr.forEach(requestTime => {
        if (previousTime === null){
            previousTime = requestTime;
        } else {
            totalTimeBetweenRequests += (requestTime - previousTime);
            previousTime = requestTime;
        }
    });

    // remove the oldest entry in the array
    requestsArr.shift();

    // this is to check the total number of seconds
    if (totalTimeBetweenRequests / 1000 < MINIMUM_SECONDS_BETWEEN_REQUESTS) {
       requestsArr = [];
       return true; 
    }

    return false;
}

app.use(bodyParser.json());

app.post("/login", (req, res) => {
  // check the mirrored request for matches to known sql injection strings
  if (isSqlInjectionAttempt(req.body.user, req.body.password)) {
    intrusionsList.push({
      intrusionType: IntrusionTypes.SqlInjection,
      info: `Attempted SQL injection with login parameters username: ${req.body.user}, password: ${req.body.password}.`,
      date: new Date(),
      id: randomUUID(),
    });

    io.emit("intrusion-detected", intrusionsList);
  }

  if(isDOSAttack(req)) {
    intrusionsList.push({
        intrusionType: IntrusionTypes.DOS,
        info: `Denial of service attack from IP: ${getRequestIP(req)}`,
        date: new Date(),
        id: randomUUID(),
    });

    io.emit("intrusion-detected", intrusionsList);
  }

  res.send().status(200);
});

io.on("connection", (socket) => {
    console.log("client connected");
    io.emit("intrusion-detected", intrusionsList);
});

server.listen(7777, () => {
  console.log("Server listening on 7777");
});
