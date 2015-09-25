var help = require("../.sys/test-help");
var fs = require("fs");

describe("package.json", function() {

  before(function() {
    pkg = require(process.env.SPECIMIN ? "./.specimin.json" : "./package.json");
  });

  help.importAndTest(__dirname, function(exported) {

    it("package.json isn't a valid json file", function() {
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
