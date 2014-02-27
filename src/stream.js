'use strict';

var emitter = require('component-emitter');

module.exports = Stream;

function Stream (channel) {

    if (!(this instanceof Stream)) {
        return new Stream(channel);
    }
    emitter(this);
    this.channel = channel;

    channel.addEventListener('message', function (evt) {
        var data = evt.data;
        this.emit.apply(this, [data.type].concat(data.args || []));
    }.bind(this));
}
