var fs = require("fs");


exports.readConfig = function(cb) {
   fs.readFile(process.cwd() + "/.ourapprc",  function(err, content) {

     if(err) {
       return cb(err);
     }

     try {
       var config = JSON.parse(content);
     } catch(e) {
       return cb(e);
     }

     cb(null, config);
   })
}


exports.readConfig(function(err, config) {
  if(err) {
    console.error("failed: " + err.stack);
    process.exit(1);
  } else {
    console.log(config);
  }
})
