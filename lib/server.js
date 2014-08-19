var express    = require("express");
var bodyParser = require("body-parser");
var path       = require("path");
var request    = require("request");
var _          = require("underscore");
var log        = require('custom-logger');
var app        = null;
var port       = 4242;

function get_querystring(url) {
  var querystring = "";
  var split = url.split("?");

  if (split.length > 1) {
    querystring = "?" + split[1];
  }

  return querystring;
}

function request_server(local_request, local_response, method, remote_url) {
  var querystring = get_querystring(local_request.url);

  log.info("----------------");
  log.info("INCOMING REQUEST");
  log.info("----------------");
  log.info("Type: "+ method);
  log.info("From: http://localhost:"+ port + local_request.url);
  log.info("To:   "+ remote_url + local_request.url);
  log.info("");

  request({
    url: (remote_url + local_request.url),
    json: local_request.body,
    method: method
  }, function(error, remote_response, body) {
    if (error) {
      log.error("Error requesting remote server: "+ error);
    } else {
      local_response.set('Content-Type', remote_response.headers["content-type"]);
      local_response.status(remote_response.statusCode).send(remote_response.body);
    }
  });
};

exports.registerHtmlExtensions = function(extensions) {
  express.static.mime.define({'text/html': extensions});
};

exports.registerPublicFolder = function(path) {
  app = express();
  app.use(bodyParser.urlencoded());
  app.use(bodyParser.json());
  app.use(express.static(path || "./"));
};

exports.registerRedirections = function(routes, remote_url) {
  if (!app) {
    exports.registerPublicFolder();
  }

  log.info("------------------");
  log.info("Registering routes");
  log.info("------------------");

  _.each(routes, function(route) {
    log.info("Route: "+ route);

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

  log.info("");
};

exports.start = function() {
  if (!app) {
    exports.registerPublicFolder();
  }

  app.listen(port);
  log.info("---------------");
  log.info("STARTING SERVER");
  log.info("---------------");
  log.info("Server running at http://localhost:"+ port +"/");
  log.info("");
};
