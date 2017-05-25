var express    = require("express");
var bodyParser = require("body-parser");
var path       = require("path");
var request    = require("request");
var _          = require("underscore");
var log        = require('custom-logger');
var livereload = require('express-livereload');
var app        = null;
var port       = null;

function get_querystring(url) {
  var querystring = "";
  var split = url.split("?");

  if (split.length > 1) {
    querystring = "?" + split[1];
  }

  return querystring;
}

function request_server(local_request, translatedUrl, local_response, method, remote_url, proxy) {
   
   log.info("----------------");
   log.info("INCOMING REQUEST");
   log.info("----------------");
   log.info("Type: "+ method);
   log.info("From: http://localhost:"+ port + local_request.url);
   log.info("To:   "+ remote_url + translatedUrl);
   log.info("");

  var options = {};
  options.url = remote_url + translatedUrl;
  options.json = local_request.body;
  options.method = method;
  options.headers = local_request.headers;

  if (proxy !== null) {
    options.proxy = proxy;
  }
  request(
    options,
    function(error, remote_response, body) {
      if (error) {
        log.error("Error requesting remote server: "+ error);
      } else {
        local_response.set('Content-Type', remote_response.headers["content-type"]);
        local_response.status(remote_response.statusCode).send(remote_response.body);
      }
    }
  );
};

exports.registerHtmlExtensions = function(extensions) {
  express.static.mime.define({'text/html': extensions});
};

exports.registerPublicFolder = function(path, useLivereload, livereloadPort) {
  path = path || "./";
  
  app = express();
  app.use(bodyParser.urlencoded());
  app.use(bodyParser.json());
  app.use(express.static(path));
  
  if (useLivereload) {
    livereload(app, {watchDir: path, port: livereloadPort});
  }
};

exports.registerRedirectionsRules = function(redirectionRules) {
  if (!app) {
    exports.registerPublicFolder();
  }
  redirectionRules.forEach(function(rule) {
      app.route(rule.path+'/*').all(function(req, res) {
	    var realUrl =  req.url.replace(rule.path,"");
		request_server(req, realUrl, res, req.method, rule.remote_url, rule.proxy);
	  });
  });
};



exports.start = function(_port) {
  port = _port;
  
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
