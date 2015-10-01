var spell = require("./spell.js");
var express = require("express");
var bodyParser = require('body-parser')
var app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.post("/api/spellcheck", function(req, res) {
  var callback = function(spelling) {
    res.send(JSON.stringify(spelling));
  };
  spell.checkSpelling(req.body.content, callback);
});
app.use(express.static("frontend"));

var server = app.listen(8181, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
