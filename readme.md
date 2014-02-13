# websocket-rpc-stream

RPC over websockets with status updates.


## Installation

Component

```bash
component install manuelstofer/websocket-rpc-stream
```


NPM

```bash
npm install websocket-rpc-stream
```


## API


Do a RPC call:

```Javascript
var RpcStream = require('websocket-rpc-stream'),
    rpc       = new RpcStream({ socket: websocket }),
    stream    = rpc.call('create hurricane', { amount: 100 });

stream.on('progress', function (progress) {
    console.log(progress);
});

stream.on('done', function (result) {
    console.log(result);
});
```



Handle RPC calls:

```Javascript
var RpcStream = require('websocket-rpc-stream'),
    rpc       = new RpcStream({ socket: websocket }),

rpc.on('create hurricane', function (options, stream) {

    var butterfly  = new Butterfly(),
        hurricanes = [];

    for (var i = 0; i < options.amount; i++) {
        var hurricane = butterfly.flap();
        hurricanes.push(hurricane);

        stream.progress(i);
    }

    stream.done(hurricanes);
});
```
