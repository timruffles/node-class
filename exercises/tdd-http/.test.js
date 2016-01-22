var help = require("../.sys/test-help");
var supertest = require("supertest");
var game = require("./game");

describe("your server", function() {

  help.importAndTest(__dirname, function(exported) {

    beforeEach(game.reset);

    beforeEach(function() {
      request = supertest(exported);
    });

    it("lets me join the game", function(done) {
      request
        .post("/players")
        .send({ name: "sarah" })
        .expect(200)
        .expect(function(res) {
          assert.equal(res.body.world.players.length, 1);
        })
        .end(done);
    });

    it("requires a name", function(done) {
      request
        .post("/players")
        .send({ id: "sarah" })
        .expect(400)
        .expect(function(res) {
          assert.property(res.body, "error");
        })
        .end(done);
    });

    it("informs me of errors in json format", function(done) {
      request
        .post("/players")
        .send({ id: "sarah" })
        .expect("Content-Type", /json/)
        .end(done);
    });

    describe("server-side errors", function() {

      var original;
      beforeEach(function() {
        original = game.join;
        game.join = function(_d, cb) {
          setTimeout(function() {
            cb(new Error("could not connect to DB"));
          }, 25);
        }
        
      });

      afterEach(function() {
        game.join = original;
      });

      it("informs clients of server-side errors with correct status", function(done) {
        request
          .post("/players")
          .send({ name: "sarah" })
          .expect(500)
          .end(done);
      });

      it("informs me of errors in json format", function(done) {
        request
          .post("/players")
          .send({ name: "sarah" })
          .expect("Content-Type", /json/)
          .expect(function(res) {
            JSON.parse(res.text);
          })
          .end(done);
      });

      it("does not leak the error", function(done) {
        request
          .post("/players")
          .send({ name: "sarah" })
          .expect(function(res) {
            assert.notMatch(res.body.error, /connect/, "leaked info");
          })
          .end(done);
      });

    });

  });


});
