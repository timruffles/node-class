/**
 * this is the server code using the code you have
 * written in exercise - don't need to change
 * anything in here
 */
var express = require("express");


module.exports = exports = function(game) {
  var server = express();

  server.use(require("body-parser").json());

  server.get("/players/:id", function(req, res, next) {
    game.getPlayer(req.params.id, function(err, state) {
      if(err) {
        return next(err);
      }

      res.send(state).end();
    });
  });

  server.post("/players", function(req, res, next) {
    if(!req.body.name) {
      return next(new Error("missing name"));
    }

    game.join({
      name: req.body.name,
    }, function(err, state) {
      if(err) {
        return next(err);
      }

      res.send(state).end();
    });
  });

  server.post("/players/:id/chats", function(req, res, next) {
    if(!req.params.id) {
      return next(new Error("missing id"));
    }

    game.chat(req.params.id, {
      text: req.body.text,
    }, function(err, state) {
      if(err) {
        return next(err);
      }

      res.send(state).end();
    });
  });

  server.use(function(err, req, res, next) {
    console.error("error: ", err.name, err.stack); 
    next();
  });

  return server;

}

