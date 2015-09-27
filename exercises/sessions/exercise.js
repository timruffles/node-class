var express = require("express");

var app = express();

app.use(require("body-parser").json())

app.use(require("express-session")({
  secret: "really, really secret",
}));

// handle POST to /note
app.post("/note", function(req, res) {
  if(req.body.text) {
    req.session.text = req.body.text;
    res.send({ ok: true })
  } else {
    res.status(400).send({
      error: "bad user, where is your note?",
    });
  }
})


// handle GET /note
app.get("/note", function(req, res) {
// - if note is in session, respond with { text: "" }
  if(req.session.text) {
    res.send({
      text: req.session.text,
    })
  } else {
// - else, respond with { error: "some error" } and a 404
    res.status(404).send({
      error: "not-found",
    })
  }
})

module.exports = app;

