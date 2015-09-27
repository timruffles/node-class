var help = require("../.sys/test-help");
var fs = require("fs");
var pkg = require("./package.json");

describe("package.json", function() {

  before(function() {
  });

  help.importAndTest(__dirname, function(exported) {


    it("is a valid json file", function() {
      assert(pkg, "invalid json");
    });

    it("has specified dependencies", function() {
      assert.property(pkg, "dependencies");
    });

    it("has express as a dependency", function() {
      assert.property(pkg.dependencies, "express");
    });
        

  });


});
