(function () {

    Request.get('api/connect')
        .then(function (config) {
            console.log(config);
            var ws = new WebSocket('ws://' + config.domain + ':' + config.port);
            // Connection opened
            ws.addEventListener('open', function (event) {
                socket.send('Hello Server!');
            });

            // Listen for messages
            ws.addEventListener('message', function (event) {
                console.log('Message from server', event.data);
            });

            ws.addEventListener('error', function (event) {
                console.error('Error occurred:', event.data);
            });  
        })
        .catch(function (error) {
            console.error(error);
        });

}());