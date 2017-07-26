var WebSocket = require('ws');
var events = require('events');
var config = require('./config.json');

var wsProtocol = config.protocol === 'https' ? 'wss' : 'ws';
var wsPort = config.protocol === 'https' ? 443 : 80;

function ClientEmitter(info) {
    events.EventEmitter.call(this);
    this.info = info;
    this.wsBuffer = [];
    this.ws = null;
    this.on('sensorData', function (data) {
        console.log(`Sensor data was called with: ${JSON.stringify(data)}`);
        data = Object.assign(data, this.info, {
            timestamp: Date.now()
        });
        if (this.wsBuffer) {
            this.wsBuffer.push(data);
        } else {
            this.ws.send(JSON.stringify(data));
        }
    });
}
ClientEmitter.prototype = Object.create(events.EventEmitter.prototype);

ClientEmitter.prototype.connect = function () {
    var self = this;
    this.ws = new WebSocket(wsProtocol + '://' + config.domain + ':' + wsPort);
    this.ws.on('open', function () {
        console.log('Client connected to server');
        self.wsBuffer.forEach(function (msg) {
            self.ws.send(JSON.stringify(msg));
        });
        self.wsBuffer = null;
    });
    this.ws.on('message', function (data) {
        console.log(data);
    });
    this.ws.on('error', function (error) {
        console.error(error);
    });
};

module.exports = ClientEmitter;