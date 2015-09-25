var Readable = require('stream').Readable;
var util = require('util');
util.inherits(SseStream, Readable);

function SseStream(res) {
  Readable.call(this, opt);
  res.pipe(this);
}


SseStream.prototype._read = function() {
}
