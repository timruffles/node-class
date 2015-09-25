var help = require("../.sys/test-help");

describe("callback API", function() {

  this.timeout(500);

  help.importAndTest(__dirname, function(exported) {

    describe("safe square", function() {

      it("must call the callback with err if not passed a number", function(done) {
        exported.safeSquare(help.rstring(), function(err) {
          done(err ? null : "passed a non-number but got no err!");
        })
      });

      it("must call the callback with the value if passed a number", function(done) {
        var x = help.rint();
        exported.safeSquare(x, function(err, val) {
          assert.equal(val, x * x);
          done();
        })
      });

      it("must not call the callback with error if passed a number", function(done) {
        var x = help.rint();
        exported.safeSquare(x, function(err, val) {
          assert(err == null || err === false, "passed a error");
          done();
        });
      });

    });

    describe("timeExecution", function() {

      function failer(cb) {
        setTimeout(cb.bind(null, "fail"));
      }

      function succeeder(val, cb) {
        setTimeout(cb.bind(null, null, val));
      }

      it("must call the callback with err if the runMe process fails", function(done) {
        exported.timeExecution(failer, function(err) {
          done(err ? null : "remember to propagate the error");
        })
      });

      it("must call the callback with the value if runMe process succeeds", function(done) {
        var x = help.rint();
        exported.timeExecution(succeeder.bind(null, x), function(err, val) {
          assert.equal(val, x);
          done();
        })
      });

      it("must not call the callback with error if the runMe process succeeds", function(done) {
        exported.timeExecution(succeeder.bind(null, help.rint()), function(err) {
          assert(err == null || err === false, "passed a error when runMe succeeded");
          done();
        });
      });

      it("must pass on the execution time as the third argument", function(done) {
        var start = +new Date;
        exported.timeExecution(timed, function(err, val, providedTime) {
          var time = new Date - start;
          assert.closeTo(time, providedTime, 10);
          done();
        })

        function timed(cb) {
          setTimeout(cb, 150);
        }
      });

    });


  });


});
