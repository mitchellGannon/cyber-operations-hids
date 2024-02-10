const fs = require("node:fs");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const expressWs = require("express-ws")(app);

const loginIntrusionChannel = expressWs.getWss("intrusions");
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
    })

    loginIntrusionChannel.clients.forEach((client) => {
        client.send();
    });
  }
});

app.listen(7777, () => {
  console.log("ids server running on 7777");
});
