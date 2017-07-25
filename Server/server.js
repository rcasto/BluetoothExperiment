var express = require('express');
var path = require('path');
var websocket = require('ws');
var http = require('http');
const helpers = require('../util/helpers');

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

app.get('/', (req, res) => res.sendFile('index.html'));
app.get('/api/connect', (req, res) => {
    res.json({
        domain: req.hostname,
        port: req.secure ? 443 : 80,
        isSecure: req.secure
    });
});

websocketServer.on('connection', (ws, req) => {
    console.log(`New client connected`);

    ws.send(JSON.stringify({
        type: 'server-message',
        data: 'hello there!'
    }));

    ws.on('message', (message) => {
        console.log(`received: ${message}`);
        message = helpers.tryParseJSON(message);
        if (message && message.type === 'web-client') {
            webClientSet.add(ws);
        } else {
            webClientSet.forEach((webClient) => {
                if (websocketServer.clients.has(webClient)) {
                    webClient.send(JSON.stringify(message));
                } else {
                    webClientSet.remove(webClient);
                }
            });
        }
    });
});

server.listen(port, () => console.log(`Server started on port ${port}`));