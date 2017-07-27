var five = require("johnny-five");
var Edison = require("edison-io");
var events = require('events');
var emitSensorData = require("../IoTClient/client");
var email = new require("emailjs/email");
var config = require('./config.json');
var deviceType = "Edison";
var deviceDesc = "Floor 3. Aisle 2. Jeans";
var sensorType1 = "Touch";
var sensorDesc1 = "Shelf 3. Blue.";
var sensorType2 = "Touch";
var sensorDesc2 = "Shelf 4. Black.";
var clientEmitter = new emitSensorData({deviceType:deviceType, deviceDesc:deviceDesc});
clientEmitter.connect();

function onActive(sensorType, sensorDesc, msg){
        sendMail(sensorDesc, msg);
	emitData(sensorType, sensorDesc, msg);
}

function sendMail(sensorDesc, msg){
		server.send({
			text: deviceDesc+".."+sensorDesc+".."+msg,
 			from: config.fromEmailUser,
			to: config.toEmail1 + "," + config.toEmail2,
			subject: msg
		}, function(err, message){console.log(err||message); });
}

function emitData(sensorType, sensorDesc, msg){
	        clientEmitter.emit("sensorData",{sensorType:sensorType, sensorDesc: sensorDesc, type:"state", value:msg});
}

var board = new five.Board({
	io:new Edison()
});

var server = email.server.connect({
	user: config.fromEmailUser,
	password: config.fromEmailPwd,
	host: config.host,
	ssl: true
});

board.on("ready", function(){
	var touch1 = new five.Button(4);
	var touch2 = new five.Button(2);
	touch1.on("press", function(){
		onActive(sensorType1, sensorDesc1, "Stocked up");
	});
	touch1.on("release", function(){
		onActive(sensorType1, sensorDesc1, "Empty");
	});
	touch2.on("press", function(){
		onActive(sensorType2, sensorDesc2, "Stocked Up");
	});
	touch2.on("release", function(){
		onActive(sensorType2, sensorDesc2, "Empty");
	});
});
