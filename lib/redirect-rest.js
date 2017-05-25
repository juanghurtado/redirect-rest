#! /usr/bin/env node

var server  = require("./server.js");
var config  = require("./config.js");
var options = config.getOptions();

server.registerHtmlExtensions(options.html_extensions);
server.registerPublicFolder(options.public_path, options.livereload, options.livereloadPort);
server.registerRedirectionsRules(options.redirection_rules);
server.start(options.port);
