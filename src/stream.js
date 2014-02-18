'use strict';

var emitter = require('emitter');

module.exports = Stream;

function Stream (channel) {
    emitter(this);
    this.channel = channel;

    channel.addEventListener('message', function (evt) {
        var data = evt.data;
        this.emit.apply(this, [data.type].concat(data.args || []));
    }.bind(this));
}
