(function () {
    var messageContainer = document.getElementById('message-container');

    function tryParseJSON(str) {
        try {
            return JSON.parse(str);
        } catch (error) {
            return null;
        }
    }

    function displayMessage(message, isError) {
        var msg = createMessage(message, isError);
        messageContainer.appendChild(msg);
    }

    function createMessage(message, isError) {
        var messageContainer = document.createElement('div');
        messageContainer.className = isError ? 'message error' : 'message';
        messageContainer.innerHTML = JSON.stringify(message);
        return messageContainer;
    }

    Request.get('api/connect')
        .then(function (config) {
            config = tryParseJSON(config);

            if (!config) {
                console.error('Config string returned is not valid JSON');
                return;
            }

            var wsProtocol = config.isSecure ? 'wss' : 'ws';
            var ws = new WebSocket(wsProtocol + '://' + config.domain + ':' + config.port);

            ws.addEventListener('open', function (event) {
                console.log('Socket connection opened with server');
            });
            ws.addEventListener('message', function (event) {
                console.log('Message from server', event.data);
                displayMessage(event.data, false);
            });
            ws.addEventListener('error', function (event) {
                console.error('Error occurred:', event.data);
                displayMessage('An error occurred', true);
            });
        })
        .catch(function (error) {
            displayMessage(error, true);
        });

}());