var fs = require("fs");

exports.ensureContent = function(path, content, cb) {

  fs.exists(path, function(yes) {
    if(yes) {
      ensure()
    } else {
      fs.writeFile(path, content, cb);
    }
  });

  function ensure() {
    fs.readFile(path, { encoding: "utf8"}, function(err, current) {
      if(err) {
        cb(err);
      } else {
        if(content === current) {
          cb();
        } else {
          fs.writeFile(path, content, cb);
        }
      }
    });
  }

}
