// TODO get the module we need to work with files

// TODO ensure content should call callback after
// the path specified has the content specified
var fs = require("fs");

exports.ensureContent = function(
 path,
 content,
 cb
) {

  fs.readFile(path, { 
    encoding: "utf8",
  }, function(err, currentContent) {
    if(err) {
  // - pass on any errors that prevent this
      cb(err);
    } else {
      if(currentContent === content) {
  // - only modify the file if necessary
        cb();
      } else {
        updateFile();
      }
    }
  });

  function updateFile() {
    fs.writeFile(path, content, cb);
  }
}
