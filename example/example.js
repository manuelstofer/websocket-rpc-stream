'use strict';

var Rpc         = require('../'),
    WebSocket   = require('ws'),
    ws          = new WebSocket('ws://localhost:8080/'),
    wss         = new WebSocket.Server({ port: 8080 });


// Client
(function () {

    // Provider
    ws.addEventListener('open', function () {
        var rpc = new Rpc({ socket: ws });

        rpc.on('bla', function (n, stream) {
            console.log('called bla');
            var result = [],
                i = 0;

            do {
                stream.progress(result.join(' '));
                result.push('bla');
            } while (++i < n);

            stream.end(result.join(' '));
        });
    });
}());



// Server
wss.on('connection', function (ws) {

    // Consumer
    var rpc = new Rpc({ socket: ws }),
        stream = rpc.call('bla', 10);

    stream.on('progress', function (result) {
        console.log(result);
    });

    stream.on('end', function (result) {
        console.log(result);
        wss.close();
    });
});
