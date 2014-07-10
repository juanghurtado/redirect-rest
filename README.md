# redirect-rest

Redirect REST requests to another server, so you can develop your Javascript app without having to launch the backend server on your machine or worry about [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing).

## Getting Started

- Install the module with: `npm install redirect-rest`
- Go to your Javascript app folder
- Create a `.redirect-rest.json` file ([read more](#config-options))
- Launch the server with `redirectrest`
- Open `http://localhost:4242/` and enjoy your redirects!

## Config options

To configure the redirections and everything else for `redirectrest`, create a `.redirect-rest.json` file on the root folder of your application.

Inside this JSON file you can have this options:

- `public_path`: Path of the assets that will be published on the HTTP server launched by `redirectrest`. Defaults to: `./`
- `html_extensions`: Array of file extensions which will be treated as `text/html` (just in case you are required to have an HTML file with backend extension: PHP, JSP…). Defaults to: `["jsp", "php", "html"]`
- `remote_url`: Base URL of the remote server, where the local requests will be redirected. Required.
- `routes`: Array of routes to be redirected. Defaults to: `[]`. If it contains Strings (`["route/one", "route/two"]`), it will redirect it as is. If it contains Objects (`[ { "route/local" : "route/remote" }, { "other/local" : "other/remote" } ]`), it will use the key as the local path for the request, and will redirect it to the value path

For example: Imagine you have a JS app and a REST API service on `http://example.com/api/`, and two routes to listen: `users` and `roles`. Your `.redirect-rest.json` file would be:

```json
{
  "html_extensions" : ["aspx", "php", "jsp"],
  "public_path" : "./",
  "remote_url" : "http://example.com/api",
  "routes" : ["users", "roles"]
}
```

This way you'll have your JS app published under `http://localhost:4242/`, and requests will be redirected as follows:

- `http://localhost:4242/users` redirects to: `http://example.com/api/users`
- `http://localhost:4242/roles` redirects to: `http://example.com/api/roles`

ASP.NET, PHP and JSP files will be treated as `text/html`.

```json
{
  "remote_url" : "http://example.com/api",
  "routes" : [{ "local/path" : "remote/path" }]
}
```

This way you'll have your JS app published under `http://localhost:4242/`, and requests will be redirected as follows:

- `http://localhost:4242/local/path` redirects to: `http://example.com/api/remote/path`

## TO-DO

- [x] Support querystrings (_v0.0.9_)
- [x] Redirect local requests to different remote path (_v0.0.8_)
- [x] Implement error forwarding to local server from remote server (_v0.0.7_)
- [x] Better logging system (_v0.0.5_)

## Acknowledgments

The original idea behind *redirect-rest* was by @drmillan. He was planning on doing something much more simple, and written in some archaic and obscure language as PHP.

I couldn't allow that `\_(ʘ_ʘ)_/`

## License

Copyright (c) 2014 Juan G. Hurtado
Licensed under the MIT license.
