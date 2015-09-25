var help = require("../.sys/test-help");
var os = require("os");
var fs = require("fs");

describe("fs", function() {

  this.timeout(100);

  help.importAndTest(__dirname, function(exported) {

    describe("ensureContent", function() {
      it("modifies the file if it doesn't have the correct contents", function(done) {
        var string = help.rstring();
        withTemp(function(path, clean) {
          exported.ensureContent(path, string, function(err) {
            assert.equal(fs.readFileSync(path, "utf8"), string);
            done(err);
          });
        });
      });


      it("doesn't modify a file if it has the correct contents", function(done) {
        var string = help.rstring();
        withTemp(function(path, clean) {
          fs.writeFileSync(path, string);
          var mtime = fs.statSync(path).mtime;

          setTimeout(function() {
            exported.ensureContent(path, string, function(err) {
              assert.equal(+mtime, +fs.statSync(path).mtime, "file was modified");
              done(err);
            });
          }, 50);
        });
      });

      it("is written asynchronously", function(done) {
        var string = help.rstring();
        withTemp(function(path, clean) {
          var mtime = fs.statSync(path).mtime;

          setTimeout(function() {
            exported.ensureContent(path, string, function() {});
            assert.equal(fs.readFileSync(path, "utf8"), "", "written synchronously");
            assert.equal(+mtime, +fs.statSync(path).mtime, "written synchronously");
            done();
          }, 50);
        });
      });

    });

  });


});

function withTemp(cb) {
  var fileId = Math.random() * 1e9 | 0;
  var file = os.tmpdir() + "/node-class-" + fileId;
  fs.writeFileSync(file, "");
  cb(file, function() {
    fs.unlink(file);
  });
}
