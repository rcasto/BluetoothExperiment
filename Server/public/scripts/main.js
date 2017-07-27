(function () {

    function tryParseJSON(str) {
        try {
            return JSON.parse(str);
        } catch (error) {
            return null;
        }
    }

    function isDebugMode() {
        return queryStringMap()['debug'] === 'true';
    }

    function queryStringMap() {
        var queryMap = {};
        window.location.search
            .slice(1)
            .split('&')
            .forEach((queryChunk) => {
                var qc = queryChunk.split('=');
                if (qc.length === 1) {
                    queryMap[qc[0]] = 'true';
                } else {
                    queryMap[qc[0]] = qc[1];
                }
            });
            return queryMap;
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

    // activate debug mode
    if (isDebugMode()) {
        var messageContainer = document.createElement('div');
        messageContainer.id = 'message-container';
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
                var msg = 'Socket connection opened with server';
                console.log(msg);
                displayMessage(msg, false);
                ws.send(JSON.stringify({
                    type: 'web-client'
                }));
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

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var id_token = googleUser.getAuthResponse().id_token;
    Request.post('tokensignin', {
        idToken: id_token
    })
    .then(function (data) {
        console.log('Token sign in result:', data);
    })
    .catch(function (error) {
        console.error(error);
    });
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}