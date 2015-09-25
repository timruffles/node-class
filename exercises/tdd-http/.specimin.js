
var express = require("express");

// we're interested in the game.join method
// - `game.join(playerData, callback)`
// callback is a standard node callback
// - callback(error, { player: {}, world: { players: [] })
var game = require("./game");


// TODO create server
var server = express();

// TODO need to parse bodies
server.use(require("body-parser").json());

// TODO accept posts to /players
server.post("/players", function(req, res) {
  // TODO pass an object with following keys/values
  // - name: name sent in post body
  // validate the name is present
  if(!req.body.name) {
    return res.status(400).send({ error: "missing name" });
  }

  game.join({
    name: req.body.name,
  }, function(err, state) {
    if(err) {
      return res.status(500).send({error: "server-error"});
    }

    res.send(state).end();
  });
});

module.exports = server;

