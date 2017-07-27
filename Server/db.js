const loki = require('lokijs');

var db = new loki('db.json', {
    autosave: true,
    autosaveInterval: 5000,
    autoload: true,
    autoloadCallback: loadCallback
});
var users, devices;

function loadCallback() {
      users = db.getCollection('users');
      if (users === null) {
        users = db.addCollection('users');
      }
      devices = db.getCollection('devices');
      if (devices === null) {
        devices = db.addCollection('devices');
      }
}

function getUser(userId) {
    return users.findOne({
        userId: userId
    }) || {};
}

function addUser(userId, userInfo) {
    users.insert(Object.assign(userInfo, {
        userId: userId
    }));
}

function addDevice(apiKey, deviceInfo) {

}

process.on('exit', () => db.close());

module.exports = {
    getUser,
    addUser,
    addDevice
};