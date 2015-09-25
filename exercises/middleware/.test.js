var help = require("../.sys/test-help");
var sinon = require("sinon");
var game = require("./game");

describe("auth middleware", function() {

    help.importAndTest(__dirname, function(exported) {

      var sendSpy;
      var statusSpy;
      var nextSpy;
      var api;

      beforeEach(function() {
        api = {};
        sendSpy = sinon.stub().returnsThis();
        statusSpy = sinon.stub().returnsThis();
        nextSpy = sinon.spy();
      });

      function fakeResponse(send, status, end) {
        var e = {
          send: send || function() {},
          status: status || function() { },
          end: end || function() {},
          locals: {},
        }
        for(var p in e) {
          api[p] = e[p];
        }
        return api;
      }

      function next() {}

      it("responds with a 401 if playerId isn't present", function() {
        exported({
          session: {}
        }, fakeResponse(sendSpy, statusSpy), nextSpy);

        sinon.assert.calledOnce(statusSpy);
        sinon.assert.calledWith(statusSpy, 401);
      });

      it("responds with a json error", function() {
        exported({
          session: {}
        }, fakeResponse(sendSpy, statusSpy), nextSpy);

        sinon.assert.calledOnce(sendSpy);
        var sent = sendSpy.getCall(0).args[0];
        assert.property(sent, "error");
      });

      it("next isn't called if there is an error", function() {
        exported({
          session: {}
        }, fakeResponse(sendSpy, statusSpy), nextSpy);

        sinon.assert.notCalled(nextSpy);
      });

      it("passes onto next in chain if playerId is present", function() {
        exported({
          session: {
            playerId: 10,
          }
        }, fakeResponse(), nextSpy);

        sinon.assert.calledWith(nextSpy);
      });

      it("augements the chain with the response of game.getPlayer", function() {
        var name = help.rstring();
        game.getPlayer = function(id, cb) {
          if(id != null) {
            cb(null, { name: name });
          } else {
            cb(new Error("unknown"));
          }
        }

        var res = fakeResponse();
        exported({
          session: {
            playerId: 10,
          }
        }, res, nextSpy);

        assert.property(res.locals, "player");
        assert.equal(res.locals.player.name, name);
      });

    });


});
