
var express = require("express");

var game = require("./game");


var app = express();

// export so we can test it
module.exports = exports = app;

// need to parse bodies
app.use(require("body-parser").json());


// accept posts to /players 
app.post("/players", function(req, res) {
  if(req.body.name) {
    // join game with submitted data via `game.join(playerData, cb)`
    // pass game.join an object with following keys/values
    // - name: name sent in post body
    game.join({
      name: req.body.name,
    }, function(err, player) {
      // handle errors from game.join
      if(err) {
        res.status(500).send({
          error: err,
        });
      } else {
        res.send(player);
      }
    });

  } else {
    // validate the name is present, giving an error if not
//
    return res.status(400).send({
      error: "missing-name",
    });
  }
});



if(require.main === module) {
  var PORT = process.env.PORT || 3000;

  app.listen(PORT, function() {
    console.log("listening on %s", PORT);
  })

}


