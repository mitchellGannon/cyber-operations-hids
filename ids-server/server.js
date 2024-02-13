const fs = require("node:fs");
const express = require("express");
const bodyParser = require("body-parser");
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, { path: "/ids-server/"});

const intrusionsList = [];

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

const isSqlInjectionAttempt = (username, password) => {
  return sqlInjectionStrings.has(username) || sqlInjectionStrings.has(password);
};

app.use(bodyParser.json());

app.post("/login", (req, _) => {
  // check the mirrored request for matches to known sql injection strings
  if (isSqlInjectionAttempt(req.body.username, req.body.password)) {
    intrusionsList.push({
        intrusionType: IntrusionTypes.SqlInjection,
        info: `Attempted SQL injection with login parameters = ${
        (req.body.username, req.body.password)
        }.`,
    });

    io.emit('intrusion-detected', intrusionsList);
    console.log('getting into this function...')
  }
});

io.on('connection', (socket) => {
    console.log('client connected');

    setTimeout(() => {
        io.emit('intrusion-detected', intrusionsList);
    }, 5000);
})

server.listen(7777, () => {
    console.log('Server listening on 7777');
});