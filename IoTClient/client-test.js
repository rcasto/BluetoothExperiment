var client = require('./client');

class Test extends client {
    constructor(info) {
        super(info);
        this.connect();
    }
    emitTest() {
        console.log('Test emit');
        this.emit('sensorData', {
            data: 'Touch sensor has been disengaged'
        });
    }
}

var test = new Test({
    type: 'Touch',
    description: 'Located in aisle 4'
});
test.emitTest();