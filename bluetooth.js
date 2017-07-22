function scanBluetooth(options) {
    options = options || {
        acceptAllDevices: true
    };
	navigator.bluetooth.requestDevice(options)
	    .then((device) => console.log(device))
	    .catch((error) => console.error(error));
}

scanBluetooth();