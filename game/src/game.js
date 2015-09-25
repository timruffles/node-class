var _ = require("lodash");
var Grid = require("./grid");
var IdMap = require("./id-map");
var EventEmitter = require("node-event-emitter").EventEmitter;

var RESPAWN_DELAY = 25;
var STARS = 1;
var STAR_TIME = 5000;

var eventId = 1;

var world = {
  h: 8,
  w: 8,
};

var DIRECTIONS = {
  UP: { x: 0, y: -1 },
  RIGHT: { x: 1, y: 0 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
};

module.exports = exports = new EventEmitter;

// state
exports.world = world;

// API
exports.reset = resetWorld;
exports.command = handleCommand;
exports.handleEvent = handleEvent;
exports.join = join;
exports.getPlayer = function(id) {
  return world.players.get(id);
}

Object.defineProperties(exports, {
  players: {
    get: function() {
      return world.players.members;
    },
  }
});

var EVENT_HANDLERS = {
  move: applyMove,
  star: starHandler,
  spawn: spawnHandler,
  blocked: blokedHandler,
  starSpawned: starSpawnedHandler,
}

function resetWorld() {
  world.id = _.uniqueId("world");

  _.extend(world, {
    players : new IdMap,
    stars : new IdMap,
    positioned : new Grid(world.w, world.h),
  });

  for(var n = STARS; n--;) {
    spawnStar();
  }
}

function handleCommand(player, data, callback) {
  var events = false;
  switch(data.command) {
  case "move": events = move(player, data.direction); break;
  }
  if(events) {
    // apply & publish events for syncing 
    events.forEach(function(event) {
      handleEvent(event);
      emit(event);
    });
    callback();
  } else {
    callback("Unknown command " + data.command);
  }
}

function handleEvent(event) {
  var handler = EVENT_HANDLERS[event.name];
  if(!handler) {
    throw new Error("missing handler " + event.name);
  }
  return handler(event);
}

function move(player, direction) {

  var delta = DIRECTIONS[direction];
  if(!delta) {
    throw new Error("invalid direction");
  }

  var target = newPosition(player, delta);

  if(outOfBounds(target)) {
    return [];
  }

  var blocked = blockers().some(function(blocker) {
    return blocker !== player && sameLocation(blocker, target);
  });

  if(blocked) {
    return [event("blocked", { player: player })];
  } 

  var events = [event("move", { player: player, target: target })];

  var star = getStar(target)
  if(star) {
    events.push(event("star", { player: player, star: star }));

    setTimeout(function() {
      spawnStar();
    }, STAR_TIME);

  }

  return events;
}







function starHandler(data) {
  var player = exports.getPlayer(data.player.id);
  player.score += 1;
  world.stars.remove(data.star);
  // don't need to replace, player already did
}

function applyMove(data) {
  var player = world.players.get(data.player.id);
  world.positioned.move(player, data.target);
  _.extend(player, data.target);
}

function spawnHandler(data) {
  var player = data.player;
  world.players.add(player);
  place(data.target.x,data.target.y,player);
}

function starSpawnedHandler(data) {
  world.stars.add(data.star);
  place(data.star.x, data.star.y, data.star);
}

function blokedHandler(data) {
}


function spawn(player, callback) {
  findFreeSpace(function(point) {
    var evt = event("spawn", { player: player, target: { x: point.x, y: point.y } });
    emit(evt);
    callback(evt);
  }, RESPAWN_DELAY);
}

function findFreeSpace(fn, n) {
  for(var attempts = 10; attempts--;) {
    var point = randomPoint();

    if(!atPosition(point)) {
      return fn(point);
    }
  }

  setTimeout(function() {
    findFreeSpace(fn)
  }, n || 500);
}

function join(data, callback) {
  var player = _.extend({ id: _.uniqueId("player"), score: 0 }, data);

  callback(null, _.extend(state(), {eventId: eventId - 1, player: player}));

  spawn(player, handleEvent);
}

function state() {
  return {
    world: {
      players: world.players.members,
      stars: world.stars.members,
      w: world.w,
      h: world.h,
    },
    eventId: eventId,
  }
}



function event(name, data) {
  return _.extend(data, {id: eventId++, name:name});
}
function emit(event) {
  exports.emit("gameEvent", event);
}


function blockers() {
  return world.players.members;
}
function atPosition(x,y) {
  if(typeof x === "object") {
    return world.positioned.get(x.x, x.y);
  }
  return world.positioned.get(x, y);
}

function outOfBounds(point) {
  return point.x < 0 || point.x >= world.w ||
    point.y < 0 || point.y >= world.h;
}

function sameLocation(a, b) {
  return a.x === b.x && a.y === b.y;
}



function newPosition(positioned, delta) {
  return point(positioned.x + delta.x, positioned.y + delta.y);
}

function point(x, y) {
  return {x: x, y:y};
}


function place(x,y,thing) {
  world.positioned.put(x, y, thing);
  thing.x = x;
  thing.y = y;
}

function randomPoint() {
  return point(randomInt(world.h), randomInt(world.w));
}

function randomInt(n) {
  return Math.random() * n | 0;
}

function getStar(target) {
  var item = atPosition(target);
  if(item && item.star === true) {
    return item;
  }
}


function spawnStar() {
  findFreeSpace(function(point) {
    var star = _.extend({ id: _.uniqueId("star"), star: true }, point);

    var evt = event("starSpawned", { star: star });
    handleEvent(evt);
    emit(evt);
  });
}

