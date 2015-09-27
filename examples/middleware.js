



var app = require("express");


app.use(function(req,res, next) {
  var time = process.hrtime();

  res.on("finish", function() {
    console.log("bye!");  
    var delta = process.hrtime() - time;
  })

  // pass on control
  next();

  // afterwards
  
});

app.post("/foo", function(req, res, next) {

  next(new Error("boo"));
  
})

app.post("/other",function(req, res, next) {

  next(new Error("boo"));
  
})




app.use(function(err,req,res, next) {
  if(canHandle(err)) {
    res.status(500).send({
      // formatted error
    });
  } else {
    next(err); // don't know how to handle
  }
});
