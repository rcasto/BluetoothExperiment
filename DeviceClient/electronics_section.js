var ultrasonic = require("jsupm_ultrasonic");
var sensor = new ultrasonic.UltraSonic(2);
var emitSensorData = require("../IoTClient/client");
var deviceType = "Edison2";
var deviceDesc = "Floor 3. Electronics ";
var sensorType = "Ultrasonic";
var sensorDesc = "Foot traffic measurement";
var clientEmitter = new emitSensorData({deviceType:deviceType, deviceDesc:deviceDesc});
clientEmitter.connect();
var state_change = "false";
var email 	= require("emailjs/email");
var server 	= email.server.connect({
	   user:    "retailtracking@gmail.com", 
	   password:"********", 
	   host:    "smtp.gmail.com", 
	   ssl:     true
});

function sendEmail(msg){
 server.send({
	   text:    deviceDesc + ".." + sensorDesc + ".." + msg, 
	   from:    "retailtracking@gmail.com", 
	   to:      "neer.ganesan@gmail.com, rcasto92@gmail.com",
	   subject: msg
 }, function(err, message) { console.log(err || message); });
}

function EmitData(msg){
	clientEmitter.emit("sensorData",{sensorType: sensorType, sensorDesc: sensorDesc, type:"state", value: msg});
}

var threshold = 0;
var ctr = 0;

var bootstrap = setInterval(function(){
	var travelTime = sensor.getDistance();
	if(travelTime > 0){
		var distance = (travelTime/ 29/ 2).toFixed(3);
		threshold += Number(distance);
		ctr++;
	}
	if(Number(ctr) == 5){
		threshold = Number(threshold)/5;
		console.log("Final Threshold is: " + threshold);
		clearInterval(bootstrap);
	}	
}, 1000);

var myInterval = setInterval(function()
{
	 if(Number(ctr) == 5)
	 {
		 var travelTime = sensor.getDistance();
		 var distance = (Number(travelTime)/ 29/ 2).toFixed(3);
		 console.log("distance: "+distance+" [cm]..");
		 if(Number(distance) <= (Number(threshold)-70) && state_change === "false")
		 {
			EmitData("Walking");
			sendEmail("Walking");
			state_change = "true";
		 }
		 else if(Number(distance) >= (Number(threshold)-70) && state_change === "true"){
			EmitData("No traffic");
			sendEmail("No traffic");
			state_change = "false";
		 } 
	 }
}, 1000);

// When exiting: clear interval and print message
process.on('SIGINT', function()
{
	 //clearInterval(myInterval);
 	 console.log("Exiting...");
  	 process.exit(0);
});
