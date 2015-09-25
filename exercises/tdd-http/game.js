/**
 * here is the stub implementation of a backend.
 *
 * you don't need to modify this - but it can be helpful
 * to read to verify how to use the .join method
 */
var players = [];
var playerId = 0;


exports.join = function(data, cb) {
  data.id = ++playerId;
  players.push(data);

  setTimeout(function() {
    cb(null, {
      world: {
        players: players,
      },
      player: data,
    });
  }, 25);

}

exports.reset = function() {
  playerId = 0;
  players = [];
}


