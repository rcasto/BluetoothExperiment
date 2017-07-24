const WebSocket = require('ws');
const config = require('./config.json');

function tryParseJSON(str) {
    try {
        return JSON.parse(str);
    } catch (error) {
        return null;
    }
}

var protocol = config.protocol === 'https' ? 'wss' : 'ws';
var port = config.protocol === 'https' ? 443 : 80;
var ws = new WebSocket(`${protocol}://${config.domain}:${port}`);

ws.on('open', () => {
    console.log('Client connected to server');
});
ws.on('message', (data) => {
    console.log(data);
});
ws.on('error', (error) => console.error(error));