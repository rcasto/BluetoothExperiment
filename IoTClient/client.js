const WebSocket = require('ws');
const request = require('request');

var protocol = 'http';
var domain = 'retailexperiments.azurewebsites.net';
var path = 'api/connect';

request.get(`${protocol}://${domain}/${path}`, (error, response, body) => {
    
});

const ws = new WebSocket('ws://www.host.com/path');

ws.on('open', function open() {
    ws.send('something');
});

ws.on('message', function incoming(data) {
    console.log(data);
});