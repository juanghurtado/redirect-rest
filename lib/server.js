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

function request_server(local_request, local_response, method, remote_url, local_route, remote_route) {
  var querystring = get_querystring(local_request.url);
  var full_local_url = "http://localhost:" + port + local_route + querystring;
  var full_remote_url = remote_url + remote_route + querystring;

  log.info("----------------");
  log.info("INCOMING REQUEST");
  log.info("----------------");
  log.info("Type: "+ method);
  log.info("From: "+ full_local_url);
  log.info("To:   "+ full_remote_url);
  log.info("");

  request({
    url: (full_remote_url),
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

function sanitize_route(route) {
  if (_.isString(route) && route.charAt(0) != "/") {
    route = "/"+ route;
  }

  return route;
}

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
    var local_route = sanitize_route(route);
    var remote_route = sanitize_route(route);

    if (_.isObject(route)) {
      var pairs = _.pairs(route);

      local_route = sanitize_route(pairs[0][0]);
      remote_route = sanitize_route(pairs[0][1]);
    }

    log.info("Route from: '"+ local_route +"' to '"+ remote_route +"'");

    // GET: List
    app.get(local_route, function(req, res) {
      request_server(req, res, "GET", remote_url, local_route, remote_route);
    });

    // POST: Create
    app.post(local_route, function(req, res) {
      request_server(req, res, "POST", remote_url, local_route, remote_route);
    });

    // GET: Get
    app.get(local_route +"/:id", function(req, res) {
      request_server(req, res, "GET", remote_url, local_route, remote_route);
    });

    // POST: Update
    app.post(local_route +"/:id", function(req, res) {
      request_server(req, res, "POST", remote_url, local_route, remote_route);
    });

    // DELETE: Delete
    app.delete(local_route +"/:id", function(req, res) {
      request_server(req, res, "DELETE", remote_url, local_route, remote_route);
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
