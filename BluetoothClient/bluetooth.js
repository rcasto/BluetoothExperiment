/*
    options is an object of the following form:
    {
        filters: Array<BluetoothScanFilters>,
        optionalServices: Array<BluetoothServiceUUIDs>,
        acceptAllDevices: <boolean> - Default = false
    }
*/
function scanBluetooth(options) {
    options = options || {
        acceptAllDevices: true
    };
	navigator.bluetooth.requestDevice(options)
	    .then((device) => console.log(device))
	    .catch((error) => console.error(error));
}

var scanBluetoothButton = document.getElementById('scan-bluetooth');
scanBluetoothButton.onclick = function (event) {
    scanBluetooth();
};