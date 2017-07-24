var express = require('express');
var path = require('path');
var websocket = require('ws');
var http = require('http');

var port = process.env.port || 3000;
var app = express();

var server = http.createServer(app);
var websocketServer = new websocket.Server({
    server
});

// Setup static routing
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile('index.html'));
app.get('/api/connect', (req, res) => {
    var config = {};
    if (port) {
        config.port = port;
    } else {
        config.port = req.secure ? 443 : 80;
    }
    config.domain = req.hostname;
    config.isSecure = req.secure;
    res.json(config);
});

websocketServer.on('connection', (ws, req) => {
    console.log(`New client connected`);
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
});

server.listen(port, () => console.log(`Server started on port ${port}`));