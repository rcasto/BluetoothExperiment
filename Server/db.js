var loki = require('lokijs');

var db = new loki('db.json', {
    autosave: true,
    autoload: true
});
var storeCollection = db.addCollection('stores');

storeCollection.insert({
    store: 'Nordstrom',
    username: 'nordstrom@gmail.com',
    password: 'password'
});