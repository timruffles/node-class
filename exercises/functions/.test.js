var help = require("../.sys/test-help");

describe("", function() {

    help.importAndTest(__dirname, function(exported) {

      it("callMeLater should call the passed function after 500ms", function(done) {
        var calls = 0;

        exported.callMeLater(function() {
          calls += 1;
        });

        setTimeout(function() {
          if(calls > 0) {
            done("Called too early!");
          }
        }, 495);

        setTimeout(function() {
          assert.equal(calls, 1, "called the wrong number of times within time!");
          done();
        }, 580);

      });

      it("createMultipler should return a function that multiples a number by initially provided value", function() {

        var n = help.rint();
        var b = help.rint();
        var multipler = exported.createMultipler(n);

        assert.isFunction(multipler, "should return a function");

        assert.equal(multipler(5), 5 * n, "check implementation");
        assert.equal(multipler(b), b * n, "check implementation");
      });

      
      it("callMeN, when passed a function, should return a function that calls the original n times", function() {

        var aCalls = help.rint();
        var called = 0;
        var callerA = exported.callMeN(function() {
          called++;
        }, aCalls);

        callerA();

        assert.equal(aCalls, called, "wrong number of calls!");

      });



    });


});
