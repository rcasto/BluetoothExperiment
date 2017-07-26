var loki = require('lokijs');

var db = new loki('db.json', {
    autosave: true,
    autoload: true
});
var users = db.addCollection('users');
var devices = db.addCollection('devices');

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

module.exports = {
    getUser,
    addUser,
    addDevice
};