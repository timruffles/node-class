var help = require("../.sys/test-help");

describe("writing tests", function() {

    help.importAndTest(__dirname, function(exported) {

      describe("the inBounds function", function() {

        function out(x,y) {
          assert.isFalse(exported.inBounds(x,y,10,10), [x,y] + " should have been out")
        }

        function within(x,y) {
          assert.isTrue(exported.inBounds(x,y,10,10), [x,y] + " should have been in");
        }


        it("prevents players leaving the top", function() {
          out(0,-5)
        });

        it("prevents players leaving the left", function() {
          out(-5,0)
        });

        it("prevents players leaving the right", function() {
          out(15,0)
        });

        it("prevents players leaving the bottom", function() {
          out(0,15)
        });

        it("allows spaces within bounds", function() {
          within(5,5)
          within(0,5)
          within(5,0)
          within(10,10)
          within(0,10)
          within(10,0)
        });

      });

    });


});
