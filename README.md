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

- `public_path`: Path of the assets that will be published on the HTTP server launched by `redirectrest`
- `html_extensions`: Array of file extensions which will be treated as `text/html` (just in case you are required to have an HTML file with backend extension: PHP, JSP…)
- `remote_url`: Base URL of the remote server, where the local requests will be redirected
- `routes`: Array of routes to be redirected

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

## License
Copyright (c) 2014 Juan G. Hurtado
Licensed under the MIT license.
