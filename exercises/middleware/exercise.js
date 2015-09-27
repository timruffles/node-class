var game = require("./game");

// export a single middleware functions as the module
//
//
// game.getPlayer's callback API is (err, player)
//
// it should call game.getPlayer(id, callback)
// - on error, send 401 and a json error, ending the chain
// - on success, set res.locals.player to the player
//
// - ensure to keep the chain going if there is no error
module.exports = exports =
  function authenticate(req, res, next) {
    if(!req.session.playerId) {
      // pass req.session.playerId to 
      //   game.getPlayer
      // error: send 401 + json
      return res.status(401).send({ error: "no" });
    }

    game.getPlayer(req.session.playerId, function(err, player) {
      if(err) {
        return next(err);
      }

      // success: augment res.locals
      res.locals.player = player;
      // success: keep chain
      next();
    });
  }




