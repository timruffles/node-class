var game = require("../src/game");
var server = require("../src/server");
var supertest = require("supertest");
var superagent = require("superagent");
var _ = require("lodash");
var assert = require("chai").assert;
var http = require("http");

var request;
var app;

describe("game", function() {

  beforeEach(game.reset);

  before(function() {
    server.listen(9988);
    request = supertest("0.0.0.0:9988");
  });

  describe("joining", function() {

    it("allows me to join the game", function(done) {

      request
        .post("/players")
        .send({
          name: "tim",
        })
        .expect(200)
        .end(function() {
          var found = _.findWhere(game.players, {name: "tim"});
          assert(found, "player not created");
          done();
        });

    });

  });

  describe("playing", function() {

    var playerId;
    var cookies;

    beforeEach(function(done) {
      request
        .post("/players")
        .send({
          name: "tim",
        })
        .expect(200)
        .end(function(err, res) {
          var found = _.findWhere(game.players, {name: "tim"});
          assert(found, "player not created");
          playerId = res.body.id;
          cookies = res.headers['set-cookie'].pop().split(';')[0];
          done(err);
        });
    });

    it("allows me to move my character", function(done) {

      var req = request
        .post("/me/commands");

      req.cookies = cookies;

      req
        .send({
          command: "move",
          direction: "DOWN",
        })
        .expect(200)
        .expect(function(res) {
          assert.equal(res.status, 200);
        })
        .end(function(err) {
          var inGame = game.getPlayer(playerId);

          assert.equal(inGame.y, 1);

          done(err);
        });

    });

    it("publishes events to keep in sync", function(done) {
      var state = waitIds("sent", "event", done);

      var req = http.request({
        hostname: 'localhost',
        port: 9988,
        path: '/events',
        method: 'GET'
      }, function(res) {
        res.on("data", function(s) {
          state("event")
        });
      });
      req.end();


      var postReq = request
        .post("/me/commands");

      postReq.cookies = cookies;

      postReq
        .send({
          command: "move",
          direction: "DOWN",
        })
        .expect(200)
        .expect(function(res) {
          assert.equal(res.status, 200);
        })
        .end(function(err) {
          if(err) {
            return done(err);
          }

          state("sent");
        });

    });

  });



});

function waitIds() {
  var callback = _.once(_.last(arguments));
  var ids = _.transform(_.initial(arguments), function(all, id) {
    all[id] = false;
  }, {});
  
  return function(id) {
    ids[id] = true;
    if(_.every(ids, function(_k,v) { return v })) {
      callback();
    }
  }
}
