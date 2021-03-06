const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const websocket = require('ws');
const http = require('http');
const GoogleAuth = require('google-auth-library');
const uuidv4 = require('uuid/v4');
const helpers = require('../util/helpers');
const dbClient = require('./db');
const config = require('./config.json');

var auth = new GoogleAuth;
var client = new auth.OAuth2(config.clientId, '', '');

var port = process.env.port || 3000;
var app = express();

var server = http.createServer(app);
var websocketServer = new websocket.Server({
    server,
    clientTracking: true
});
var webClientSet = new Set();

// Setup static routing
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => res.sendFile('index.html'));
app.get('/api/connect', (req, res) => {
    res.json({
        domain: req.hostname,
        port: 443,
        isSecure: true
    });
});
app.post('/tokensignin', (req, res) => {
    var token = req.body && req.body.idToken;
    res.send(token);
    client.verifyIdToken(
        token,
        config.clientId,
        (error, login) => {
            if (error) {
                res.json(error);
                return;
            }
            var payload = login.getPayload();
            var userid = payload['sub'];
            var apiKey = dbClient.getUser(userid).apiKey;
            if (!apiKey) {
                apiKey = uuidv4();
                dbClient.addUser(userid, {
                    apiKey: apiKey
                });
            }
            res.send(apiKey);
        });
});

websocketServer.on('connection', (ws, req) => {
    console.log(`New client connected`);
    ws.on('message', (message) => {
        console.log(`received: ${message}`);
        message = helpers.tryParseJSON(message);
        if (message) {
            if (message.type === 'web-client') {
                webClientSet.add(ws);
            } else { 
                // echo/send message to all web clients that are connected
                webClientSet.forEach((webClient) => {
                    if (websocketServer.clients.has(webClient)) {
                        webClient.send(JSON.stringify(message));
                    } else {
                        webClientSet.delete(webClient);
                    }
                });
            }
        }
    });
});

server.listen(port, () => console.log(`Server started on port ${port}`));