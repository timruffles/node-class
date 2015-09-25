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


