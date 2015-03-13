var fs         = require("fs");
var log        = require('custom-logger').config({ level: 0 });
var _          = require("underscore");
var configfile = ".redirect-rest.json";

exports.getOptions = function() {
  var data = fs.readFileSync(configfile);

  if (!data) {
    log.error("Can't find a .redirect-rest.json file. Please create it to tell us what requests you want to redirect to a remote server.");
    return;
  }

  var options = JSON.parse(data);

  options = _.defaults(options, {
    html_extensions : ["html", "php", "jsp"],
    public_path     : "./",
    port            : 4242,
    proxy           : null,
    livereload      : false,
    livereloadPort  : 35729
  });

  if (!options.redirection_rules || options.redirection_rules == "") {
    log.error("You must set a value for `redirection_rules` attribute on your .redirect-rest.json file");
    return;
  }

  log.info("--------------");
  log.info("CONFIG OPTIONS");
  log.info("--------------");
  log.info("public_path:     "+ options.public_path);
  log.info("html_extensions: "+ options.html_extensions);
  log.info("redirection_rules:  ");
  options.redirection_rules.forEach(function(rule) {
     log.info("");
	 log.info("   path: "+ rule.path);
	 log.info("   remote_url: "+rule.remote_url);
	 log.info("   proxy: "+rule.proxy);
	 log.info("");
  });
  log.info("port:            "+ options.port);
  log.info("livereload:      "+ options.livereload);
  log.info("livereloadPort:  "+ options.livereloadPort);
  
  log.info("");

  return options;
};
