
var EventEmitter = require("events").EventEmitter;

module.exports = exports = new EventEmitter;

exports.listenToGame = function(game) {
  game.addListener("gameEvent", function(event) {
    exports.emit(event.name, event);
  });
}

