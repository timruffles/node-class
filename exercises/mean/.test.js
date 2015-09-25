var help = require("../.sys/test-help");
var supertest = require("supertest");
var server = require("./server");

describe("persisted API", function() {

    this.timeout(100);

    help.importAndTest(__dirname, function(exported) {

      var playerId;
      var chat = "blah: " + help.rstring();
      var request;


      before(function() {
        request = supertest(server(exported));
      });

      it("responds to player creation", function(done) {
        request
          .post("/players")
          .send({ name: "amy" })
          .expect(200)
          .expect(function(res) {
            assert.equal(res.body.name, "amy")
            assert.property(res.body, "_id");
            
            playerId = res.body._id;
          })
          .end(done);
      });
      
      it("is possible to retrieve player", function(done) {
        if(!playerId) {
          return done(new Error("can't run test without player"));
        }
        request
          .get("/players/" + playerId)
          .expect(200)
          .expect(function(res) {
            assert.equal(res.body.name, "amy", "should have stored name in `.name`")
            assert.property(res.body, "_id");
          })
          .end(done);
      });

      it("responds to comment creation", function(done) {
        if(!playerId) {
          return done(new Error("can't run test without player"));
        }
        request
          .post("/players/" + playerId + "/chats")
          .send({
            text: chat,
          })
          .expect(200)
          .expect(function(res) {
            assert.equal(res.body.text, chat, "should have .text property set")
          })
          .end(done);
      });

      it("is possible to retrieve chats from within player document", function(done) {
        if(!playerId) {
          return done(new Error("can't run test without player"));
        }
        request
          .get("/players/" + playerId)
          .expect(200)
          .expect(function(res) {
            assert.lengthOf(res.body.chats, 1, "should have stored chat in `.chats` array")
            assert.equal(res.body.chats[0].text, chat, "should have stored chat text in `.text`")
          })
          .end(done);
      });

    });


});
