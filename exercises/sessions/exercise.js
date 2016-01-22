var express = require("express");

var app = express();

app.use(require("body-parser").json());

// TODO setup session handling with the 'express-session'
// module


// TODO handle POST to /note
// with body of { text: "" }, store the body in the session

// TODO handle GET /note
// - if note is in session, respond with { text: "" }
// - else, respond with { error: "some error" } and a 404

module.exports = app;

