var help = require("../.sys/test-help");
var sinon = require("sinon");
var EventEmitter = require("events").EventEmitter;

describe("listening to events", function() {

    help.importAndTest(__dirname, function(exported) {

      it("listens to gameEvent", function() {
        var game = new EventEmitter;

        var mock = sinon.mock(game)
          .expects("addListener")
          .once()
          .withArgs("gameEvent", sinon.match.func);

        exported.listenToGame(game);

        mock.verify();
      });

      it("passes on any emittedGame events as its own event", function() {
        var game = new EventEmitter;
        var spy = sinon.spy();
        var string = help.rstring();

        var event = { name: string };
        exported.addListener(string, spy);

        exported.listenToGame(game);

        game.emit("gameEvent", event);

        sinon.assert.calledOnce(spy);
        sinon.assert.calledWith(spy, event);
      });

    });


});
