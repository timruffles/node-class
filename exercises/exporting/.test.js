var help = require("../.sys/test-help");
var rint = help.rint;

describe("exporting", function() {

  help.importAndTest(__dirname, function(exported) {

      it("exported square method", function() {
        var val = rint();
        assert.equal( exported.square(val), val * val);
      });

      it("exported add method", function() {
        var a = rint();
        var b = rint();
        assert.equal( exported.add(a, b), a + b);
      });


    });


});

