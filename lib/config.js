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

  if (!options.remote_url || options.remote_url == "") {
    log.error("You must set a value for `remote_url` attribute on your .redirect-rest.json file");
    return;
  }

  log.info("--------------");
  log.info("CONFIG OPTIONS");
  log.info("--------------");
  log.info("public_path:     "+ options.public_path);
  log.info("html_extensions: "+ options.html_extensions);
  log.info("remote_url:      "+ options.remote_url);
  log.info("port:            "+ options.port);
  log.info("proxy:           "+ options.proxy);
  log.info("livereload:      "+ options.livereload);
  log.info("livereloadPort:  "+ options.livereloadPort);
  log.info("");

  return options;
};
