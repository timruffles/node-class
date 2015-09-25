var Grid = require("../src/grid");
var IdMap = require("../src/id-map");
var game = require("../src/game")

game.reset();

angular.module("game",[])
.controller("AppCtrl", AppCtrl)
.controller("GameCtrl", GameCtrl)
.factory("game", gameFactory)
.service("persistence", persist)
.directive("keyboardHandler", keyboardHandler)
.filter("characterImage", characterImage)


function AppCtrl(game, $scope) {
  game.join();
  $scope.world = game.world;
};

function GameCtrl($scope, game) {

  $scope.game = game;

  this.move = function(direction) {
    game.move(direction);
  };

  this.attack = function() {
    game.attack();
  };

  $scope.rows = function() {
    return _.range(0, game.world.w);
  }
  $scope.columns = function() {
    return _.range(0, game.world.h);
  }

  $scope.occupant = function(x,y) {
    return game.at(x,y)
  }

  $scope.position = function(x, y) {
    return { left: x * 101 + "px", top: y * 85 + "px" };
  }
}

function p() {
  console.log.apply(console, arguments);
}

function gameFactory(persistence) {


  var api = {};
  var grid;
  var world;
  var player;

  api.world = game.world;

  api.move = function(direction) {
    persistence.command("move", { direction:  direction.toUpperCase()})
  };

  api.attack = function() {
    persistence.command("attack")
  };

  api.join = function() {
    persistence.join()
      .then(function(gameState) {
        _.extend(game.world, {
          players: new IdMap(gameState.world.players),
          stars: new IdMap(gameState.world.stars),
        });
        player = api.player = gameState.player;

        game.world.players.members.concat(game.world.stars.members).forEach(function(item) {
          game.world.positioned.add(item);
        });

        api.ready = true;
      });
  }

  api.at = function(x,y) {
    return game.world.positioned.get(x,y);
  }

  return api;
}

function persist($http, $rootScope, $q) {


  function live() {
    var updates = new EventSource('/events');

    var started = false;
    var buffer = [];
    updates.addEventListener("gameEvent", jsonEvent(handler));

    function handler(event) {
      if(!started) {
        console.debug("buffering ", event);
        return buffer.push(event);
      }

      $rootScope.$apply(function() {
        console.log(event.name, event);
        game.handleEvent(event);
      });
    }

    var def = $q.defer();
    updates.addEventListener("connected", connected);

    return def.promise;

    function connected() {
      def.resolve(function(currentEventId) {
        console.debug("applying ", buffer);
        buffer.forEach(function(event) {
          if(event.id > currentEventId) {
            handler(event);
            console.log("applied", event);
          } 
        });
        buffer = [];
        started = true;
      });
      updates.removeEventListener("connected", connected);
    }
  }

  this.command = function(name, data) {
    data = data || {};

    return $http.post("/me/commands", _.defaults({ command: name }, data))
      .then(function(res) {
        return res.data;
      })
  }

  this.join = function(game) {
    var connected = live();

    var gameState = connected.then(function() {
      return $http.post("/players", {name: "tim"})
        .then(function(res) {
          return res.data;
        });
    })

    $q.all({ state: gameState, applyEvents: connected })
      .then(function(data) {
        data.applyEvents(data.state.eventId)
      });

    return gameState;
  }


}



function jsonEvent(fn) {
  return function(d) {
    d = JSON.parse(d.data);
    fn(d);
  }
}

function keyboardHandler($window, $parse, $sce) {
  return {
    restrict: "E",
    scope: {
      keys: "&",
    },
    link: function(scope, el, attrs) {
      var handlers;

      scope.$on("$destroy", cleanUp);
      $window.addEventListener("keydown", handler);

      attrs.$observe("keys", function(val) {
        handlers = _.transform(scope.keys(), function(all, expr, k) {
          all[k] = $parse(expr);
        });
      });

      function handler(event) {
        var expr = handlers[event.keyCode];
        if(expr) {
          event.preventDefault();
          var v = expr(scope);
        }
      }

      function cleanUp() {
        $window.removeEventListener("keydown", v);
      }
    },
  }
}

function characterImage() {
  var images = {
    star: "Star",
    player: "Character Horn Girl",
  };
  return function(c) {
    var prefix = c.id.match(/^[a-zA-Z]+/)[0];
    return "img/" + images[prefix] + ".png";
  }
}
