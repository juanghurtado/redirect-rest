var fs = require("fs");
var _ = require("underscore");
var configfile = ".redirect-rest.json";

exports.getOptions = function() {
  var data = fs.readFileSync(configfile);

  if (!data) {
    console.log("Can't find a .redirect-rest.json file. Please create it to tell us what requests you want to redirect to a remote server.");
    return;
  }

  var options = JSON.parse(data);

  options = _.defaults(options, {
    html_extensions: ["html", "php", "jsp"],
    routes: [],
    public_path: "./"
  });

  if (!options.remote_url || options.remote_url == "") {
    console.log("You must set a value for `remote_url` attribute on your .redirect-rest.json file");
    return;
  }

  return options;
};
