(function () {

    function tryParseJSON(str) {
        try {
            return JSON.parse(str);
        } catch (error) {
            return null;
        }
    }

    Request.get('api/connect')
        .then(function (config) {
            config = tryParseJSON(config);

            if (!config) {
                console.error('Config string returned is not valid JSON');
                return;
            }

            var ws = new WebSocket('ws://' + config.domain + ':' + config.port);

            ws.addEventListener('open', function (event) {
                socket.send('Hello Server!');
            });
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