var help = require("../.sys/test-help");

describe("writing tests", function() {

    help.importAndTest(__dirname, function(exported) {

      describe("the outOfBounds function", function() {

        function out(x,y) {
          return exported.outOfBounds(x,y,10,10)
        }

        function within(x,y) {
          return !exported.outOfBounds(x,y,10,10)
        }


        it("prevents players leaving the top", function() {
          assert.isTrue(out(0,-5))
        });

        it("prevents players leaving the left", function() {
          assert.isTrue(out(-5,0))
        });

        it("prevents players leaving the right", function() {
          assert.isTrue(out(15,0))
        });

        it("prevents players leaving the bottom", function() {
          assert.isTrue(out(0,15))
        });

        it("allows spaces within bounds", function() {
          assert.isTrue(within(5,5))
        });

      });

    });


});
