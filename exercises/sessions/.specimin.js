var express = require("express");

var app = express();

app.use(require("body-parser").json());

// TODO setup session handling with the 'express-session'
// module
app.use(require("express-session")({
  secret: process.env.SECRET || "fooby",
  resave: true,
  saveUninitialized: true,
}));


// TODO handle posts to /note
// with body of { text: "" }, store the body in the session
app.post("/note", function(req,res) {
  req.session.last = req.body;
  res.status(200).end();
});

// TODO handle GET /note
// - if note is in session, respond with { text: "" }
// - else, respond with { error: "some error" } and a 404
app.get("/note", function(req,res) {
  if(req.session.last) {
    res.send(req.session.last);
  } else {
    res.status(404).send({ error: "no note stored" });
  }
});

module.exports = app;
