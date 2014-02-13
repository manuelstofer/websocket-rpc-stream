'use strict';

var Emitter     = require('emitter'),
    Multiplexer = require('websocket-multiplexer'),
    Stream      = require('./stream');

module.exports = Rpc;

/**
 * Remote procedure calls over web sockets with progress
 *
 * @param options
 * @constructor
 */
function Rpc (options) {
    this.socket = options.socket;
    this.multiplexer = new Multiplexer({ socket: options.socket });
    this.multiplexer.addEventListener('channel', this.handleCall.bind(this));
}

Emitter(Rpc.prototype);


/**
 * Call a remote procedure
 *
 * @returns {Stream}
 */
Rpc.prototype.call = function () {
    var channel = this.multiplexer.channel(),
        args    = [].slice.call(arguments),
        name    = args.shift();

    channel.send({ call: name, args: args });
    return new Stream(channel);
};


/**
 * Handle a remote procedure call
 *
 * @param evt
 */
Rpc.prototype.handleCall = function (evt) {
    var channel        = evt.channel;

    channel.addEventListener('message', function (evt) {
        var packet = evt.data,
            call   = packet.call,
            args   = packet.args,
            stream = {
                end: function () {
                    console.log({ end: arguments });
                    channel.send({ type: 'end', args: [].slice.call(arguments) });
                    channel.close();
                },
                progress: function () {
                    console.log({ progress: arguments })
                    channel.send({ type: 'progress', args: [].slice.call(arguments) });
                }
            };

        this.emit.apply(this, [].concat(call, args, stream));
        this.emit.apply(this, [].concat('_any', call, args, stream));
    }.bind(this));
};
