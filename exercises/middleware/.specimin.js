var game = require("./game");

module.exports = function authenticate(req, res, next) {
  var player = game.getPlayer(req.session.playerId, function(err, player) {
    if(err) {
      return res.status(401).send({
        error: "need to join first",
      }).end();
    } else {
      res.locals.player = player;
      next();
    }
  });
}
