#! /usr/bin/env node
/*
 * redirect-rest
 * https://github.com/juanghurtado/redirect-rest
 *
 * Copyright (c) 2014 Juan G. Hurtado
 * Licensed under the MIT license.
 */

'use strict';

var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var request = require("request");
var _ = require("underscore");
var fs = require("fs");
var configfile = ".redirect-rest.json";

fs.readFile(configfile, "utf8", function (err, data) {
  if (err) {
    console.log("Can't find a .redirect-rest.json file. Please create it to tell us what requests you want to redirect to a remote server.");
    console.log("Error: " + err);
    return;
  }


  var options = JSON.parse(data);

  if (!options.remote_url || options.remote_url == "") {
    console.log("You must set a value for `remote_url` attribute on .redirect-rest.json file");
    return;
  }

  if (!options.routes) {
    console.log("You must set an array of values for `routes` attribute on .redirect-rest.json file");
    return;
  }

  var html_extensions = options.html_extensions || ["jsp", "php", "html"];
  express.static.mime.define({'text/html': html_extensions});

  var app = express();
  app.use(bodyParser());
  app.use(express.static(options.public_path || "./"));

  function request_server(local_request, local_response, method) {
    console.log("Type: "+ method);
    console.log("From: http://localhost:4242"+ local_request.url);
    console.log("To:   "+ options.remote_url + local_request.url);
    console.log("----------------------------------------");

    request({
      url: (options.remote_url + local_request.url),
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

  _.each(options.routes, function(route) {
    // GET: List
    app.get("/"+ route, function(req, res) {
      request_server(req, res, "GET");
    });

    // POST: Create
    app.post("/"+ route, function(req, res) {
      request_server(req, res, "POST");
    });

    // GET: Get
    app.get("/"+ route +"/:id", function(req, res) {
      request_server(req, res, "GET");
    });

    // POST: Update
    app.post("/"+ route +"/:id", function(req, res) {
      request_server(req, res, "POST");
    });

    // DELETE: Delete
    app.delete("/"+ route +"/:id", function(req, res) {
      request_server(req, res, "DELETE");
    });
  });

  // Launch server
  app.listen(4242);
  console.log("Server running at http://localhost:4242/");
});
