var Request = (function () {
    function get(url) {
        return new Promise(function (resolve, reject) {
            var xhr = window.XMLHttpRequest ? 
                new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            xhr.open('GET', url);
            xhr.onreadystatechange = function () {
                if (xhr.readyState > 3 && xhr.status === 200) {
                    resolve(xhr.responseText);
                }
            };
            xhr.onerror = reject;
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.send(); 
        });
    }

    function post(url, data) {
        return new Promise((resolve, reject) => {
            var params = typeof data === 'string' ? data : 
                Object.keys(data).map((k) => {
                    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
                }).join('&');
            var xhr = window.XMLHttpRequest ? 
                new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
            
            xhr.open('GET', url);
            xhr.onreadystatechange = () => {
                if (xhr.readyState > 3 && xhr.status === 200) { 
                    resolve(xhr.responseText); 
                }
            };
            xhr.onerror = reject;
            
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            
            xhr.send(params);
        });
    }

    return {
        get: get,
        post: post
    };
}());