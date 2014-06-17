var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var request = require("request");
var _ = require("underscore");
var app = null;

function request_server(local_request, local_response, method, remote_url) {
  console.log("Type: "+ method);
  console.log("From: http://localhost:4242"+ local_request.url);
  console.log("To:   "+ remote_url + local_request.url);
  console.log("----------------------------------------");

  request({
    url: (remote_url + local_request.url),
    json: local_request.body,
    method: method
  }, function(error, remote_response, body) {
    if (error) {
      console.log("Error requesting remote server: "+ error);
    } else {
      local_response.json(remote_response.body);
    }
  });
};

exports.registerHtmlExtensions = function(extensions) {
  express.static.mime.define({'text/html': extensions});
};

exports.registerPublicFolder = function(path) {
  app = express();
  app.use(bodyParser());
  app.use(express.static(path || "./"));
};

exports.registerRedirections = function(routes, remote_url) {
  if (!app) {
    exports.registerPublicFolder();
  }

  _.each(routes, function(route) {
    // GET: List
    app.get("/"+ route, function(req, res) {
      request_server(req, res, "GET", remote_url);
    });

    // POST: Create
    app.post("/"+ route, function(req, res) {
      request_server(req, res, "POST", remote_url);
    });

    // GET: Get
    app.get("/"+ route +"/:id", function(req, res) {
      request_server(req, res, "GET", remote_url);
    });

    // POST: Update
    app.post("/"+ route +"/:id", function(req, res) {
      request_server(req, res, "POST", remote_url);
    });

    // DELETE: Delete
    app.delete("/"+ route +"/:id", function(req, res) {
      request_server(req, res, "DELETE", remote_url);
    });
  });
};

exports.start = function() {
  if (!app) {
    exports.registerPublicFolder();
  }

  app.listen(4242);
  console.log("Server running at http://localhost:4242/");
};
