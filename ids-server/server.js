const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const expressWs = require('express-ws')(app);

const loginIntrusionChannel = expressWs.getWss('intrusions');
const intrusions = [];

app.post('/login', (req, _) => {
    
});