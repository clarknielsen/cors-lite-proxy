const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

var app = express();
var PORT = process.env.PORT || 3000;

// exclude list
var headers = ["host", "connection", "accept", "x-requested-with", "user-agent", "dnt", "referer", "accept-encoding", "accept-language", "if-none-match"];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/test", function(req, res) {
  res.sendFile(__dirname + "/test.html");
});

app.get("*", function(req, res) {

  var url = req.path.substr(1);
  var query = "?";

  // check for valid url
  if (url.indexOf("http") !== 0) {
    return res.send("Hi");
  }

  // re-build query string
  for (let i in req.query) {
    query += `${i}=${req.query[i]}&`; 
  }

  var config = {
    headers: {}
  };

  // preserve custom-sent headers
  for (let i in req.headers) {
    if (headers.indexOf(i) === -1) {
      config.headers[i] = req.headers[i];
    }
  }

  axios.get(url + query, config).then(function(data) {
    // send back retreived data
    res.status(200).json(data.data);
  }).catch(function(err) {
    // preserve status code with error
    res.status(err.response.status).send(err.response.data);
  });
});

app.listen(PORT, function() {
  console.log(`App running on port ${PORT}!`);
});