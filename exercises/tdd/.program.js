
var express = require("express");

var server = express();

server.get("/game", function(req, res) {
  switch(process.env.GOAL) {
  case "game-working":
    res.send({
      players: []
    }).end();
  break;
  case "game-500":
    res.status(500).end();
  break;
  case "game-invalid-json":
    res.send("foo").end();
  break;
  }
});
