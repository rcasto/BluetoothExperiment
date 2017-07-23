var eddystoneBeacon = require('eddystone-beacon');

var url = 'http://google.com';
var options = {
    name: 'BeaconTest',    // set device name when advertising (Linux only)
    // txPowerLevel: -21, // override TX Power Level, default value is -21,
    // tlmCount: 2,       // 2 TLM frames
    // tlmPeriod: 10      // every 10 advertisements
};

eddystoneBeacon.advertiseUrl(url, options);