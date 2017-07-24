const WebSocket = require('ws');
const request = require('request');

var protocol = 'http';
var domain = 'retailexperiments.azurewebsites.net';
var path = 'api/connect';

function tryParseJSON(str) {
    try {
        return JSON.parse(str);
    } catch (error) {
        return null;
    }
}

request.get(`${protocol}://${domain}/${path}`, (error, response, body) => {
    if (error) {
        console.error(error);
        return;
    }

    body = tryParseJSON(body);

    if (body) {
        const ws = new WebSocket(`wss://${body.domain}:${body.port}`);
        ws.on('open', function open() {
            console.log('Client connected to server');
        });
        ws.on('message', function incoming(data) {
            console.log(data);
        });
    }
});