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
var app = express();
var fs = require("fs");
var configfile = ".redirectrest.json";

fs.readFile(configfile, "utf8", function (err, data) {
  if (err) {
    console.log("Can't find a .redirectrest.json file. Please create it to tell us what requests you want to redirect to a remote server.");
    console.log("Error: " + err);
    return;
  }

  var options = JSON.parse(data);

  app.use(bodyParser());
  app.use(express.static(options.public_path));

  function request_server(local_request, local_response, method) {
	  console.log("Request to:     http://localhost:4242"+ local_request.url);
	  console.log("Redirecting to: "+ options.remote_url + local_request.url);
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
		  request_server(req, res, "POST");
	  });
  });

  // Launch server
  app.listen(4242);
  console.log("Server running at http://localhost:4242/");
});
