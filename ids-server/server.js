const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const expressWs = require('express-ws')(app);

const loginIntrusionChannel = expressWs.getWss('intrusions');
const intrusions = [];

app.use(bodyParser.json());
app.get('/test', (req, res) => {
    res.send('server is running');
})
app.post('/login', (req, _) => {
    // check the mirrored request for matches to known sql injection strings
    console.log(req.body);

});

app.listen(7000, () => {
    console.log('ids server running on 6000');
});