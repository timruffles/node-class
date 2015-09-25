var game = require("./game");
var _ = require("lodash");
var sse = require("../lib/sse");
var fs = require("fs");

var static = require('serve-static')

var express = require("express");

game.reset();

var app = express();
app.use(function(err, req, res, next) {
  console.log("unhandled error %s", err);
});
app.use(require("body-parser").json());
app.use(require("express-session")({
  secret: process.env.SESSION_SECRET || "not safe",
  resave: true,
  saveUninitialized: true,
}));

app.use(require("serve-static")(
  __dirname + "/../client"
));


var VALID_COMMAND_KEYS = ["command", "direction"];

app.post("/players", function(req, res) {
  game.join({
    name: req.body.name,
  }, function(err, state) {
    if(err) {
      return res.status(500).end();
    }

    req.session.playerId = state.player.id;

    res.send(state).end();
  });
});

app.post("/me/commands", authenticate, function(req, res) {

  game.command(
    res.locals.player,
    _.pick( req.body, VALID_COMMAND_KEYS ),
    function(err) {
      if(err) {
        console.error(err.stack || err);
      }
      return res.status(err ? 500 : 200).end();
    }
  );

});

app.get("/events", function(req, res) {

  var send = sse.start(res);

  send("connected", {});
  game.addListener("gameEvent", handleEvent);

  res.on("end", function() {
    game.removeListener("gameEvent", handleEvent);
  });

  function handleEvent(event) {
    console.log("sending '%s'", event.name);
    send("gameEvent", event);
  }
});


app.get("*", function(req, res) {
  if(req.accepts("html")) {
    fs.createReadStream(__dirname + "/../client/index.html").pipe(res);
  } else {
    res.status(404).end();
  }
});

function authenticate(req, res, next) {
  var player = game.getPlayer(req.session.playerId);
  if(player) {
    res.locals.player = player;
    next();
  } else {
    return res.status(400).send({
      error: "need to join first",
    }).end();
  }
}

if(require.main === module) {
  app.listen(3000, function() {
    console.log("Game server listening...");
  })

} else {
  module.exports = app;
}
