var five = require("johnny-five");
var Edison = require("edison-io");
var events = require('events');
var eventEmitter = new events.EventEmitter();
var email = new require("emailjs/email");
var emitSensorData = require("../IoTClient/client");
var deviceType = "Edison";
var deviceDesc = "Floor 3. Aisle 2. Jeans";
var sensorType1 = "Touch";
var sensorDesc1 = "Shelf 3. Blue.";
var sensorType2 = "Touch";
var sensorDesc2 = "Shelf 4. Black.";
var clientEmitter = new emitSensorData({deviceType:deviceType, deviceDesc:deviceDesc});
var board = new five.Board({
	io:new Edison()
});
var server = email.server.connect({
	user: "retailtracking@gmail.com",
	password: "**********",
	host: "smtp.gmail.com",
	ssl: true
});

var sentData = function(){
	console.log("Emitted data");
};

clientEmitter.connect();
board.on("ready", function(){
	var touch1 = new five.Button(4);
	var touch2 = new five.Button(2);
	var led = new five.Led(6);
	var lcd = new five.LCD({
		controller: "JHD1313M1"
	});
	lcd.useChar("check");
	touch1.on("press", function(){
			server.send({
				text: deviceDesc + ".." + sensorDesc1 + "..Stocked up",
				from: "retailtracking@gmail.com",
				to:"neer.ganesan@gmail.com, rcasto92@gmail.com",
				subject:"Stocked up"
			}, function(err, message){console.log(err||message); });
		led.off();
		console.log("Just chill.");
		lcd.bgColor(0,255,0);
		lcd.clear();
		lcd.cursor(0,0).print("Aisle 4 - Good :check:");
		clientEmitter.emit("sensorData",{sensorType: sensorType1, sensorDesc: sensorDesc1, type:"state", value: "Stocked"});
	});
	touch1.on("release", function(){
		led.on();
		console.log("Stock up on Clothes");
		lcd.bgColor(255,0,0);
		lcd.clear();
	        lcd.cursor(0,0).print("Aisle 4 - Stock up!!");
	        clientEmitter.emit("sensorData",{sensorType:sensorType1, sensorDesc: sensorDesc1, type:"state", value:"Empty"});
		server.send({
			text: deviceDesc+".."+sensorDesc1+"..Empty",
 			from: "neer.ganesan@gmail.com",
			to:"neer.ganesan@gmail.com, rcasto92@gmail.com",
			subject: "Empty shelf"
		}, function(err, message){console.log(err||message); });
	});
});
