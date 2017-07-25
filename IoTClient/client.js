const WebSocket = require('ws');
const events = require('events');
const config = require('./config.json');

var wsProtocol = config.protocol === 'https' ? 'wss' : 'ws';
var wsPort = config.protocol === 'https' ? 443 : 80;

class ClientEmitter extends events.EventEmitter {
    constructor(info) {
        super();
        this.info = info;
        this.wsBuffer = [];
        this.ws = null;
        this.on('sensorData', (data) => {
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
    connect() {
        this.ws = new WebSocket(`${wsProtocol}://${config.domain}:${wsPort}`);
        this.ws.on('open', () => {
            console.log('Client connected to server');
            this.wsBuffer.forEach((msg) => this.ws.send(JSON.stringify(msg)));
            this.wsBuffer = null;
        });
        this.ws.on('message', (data) => {
            console.log(data);
        });
        this.ws.on('error', (error) => console.error(error));
    }
}

module.exports = ClientEmitter;