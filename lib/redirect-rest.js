#! /usr/bin/env node

var server  = require("./server.js");
var config  = require("./config.js");
var options = config.getOptions();

server.registerHtmlExtensions(options.html_extensions);
server.registerPublicFolder(options.public_path);
server.registerRedirections(options.routes, options.remote_url);
server.start(options.port);
