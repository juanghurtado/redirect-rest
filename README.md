# redirect-rest

Redirect REST requests to other servers, so you can develop your Javascript app without having to launch the backend server on your machine or worry about [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing).

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
- `redirection_rules`: array that contains the redirection rules to redirect to one or many remote servers. Required.
                       Each item in the array is formed by:
					   - `path`: path used in the request in order to redirect to the remote server. Required.
					   - `remote_url`: Base URL of the remote server, where the local requests will be redirected. Required.
					   - `proxy`: Proxy to be used to make remote server requests. Optional.
				   
- `port`: Local server port
- `livereload`: Make use of LiveReload to refresh the browser on local changes
- `livereloadPort`: Port to be used with LiveReload

For example: Imagine you have a JS app and two REST API services on `http://example.com/api/` and `http://anotherexample.com/api/`. Your `.redirect-rest.json` file would be:

```json
{
  "html_extensions" : ["aspx", "php", "jsp"],
  "public_path" : "./",
  "redirection_rules" : [
               {
                 "path": "/example",
                 "remote_url": "http://example.com/api"
               },
			   {
                 "path": "/anotherExample",
                 "remote_url": "http://anotherExample.com/api"
               }
			   ]
}
```

This way you'll have your JS app published under `http://localhost:4242/`, and requests will be redirected as follows:

- `http://localhost:4242/example/users` redirects to: `http://example.com/api/users`
- `http://localhost:4242/example/roles` redirects to: `http://example.com/api/roles`
- `http://localhost:4242/exmaple/whatever` redirects to: `http://example.com/api/whatever`

- `http://localhost:4242/anotherexample/clients` redirects to: `http://anotherexample.com/api/clients`
- `http://localhost:4242/anoherexample/products` redirects to: `http://anotherexample.com/api/products`
- `http://localhost:4242/anotherexample/whatever` redirects to: `http://anotherexample.com/api/whatever`


ASP.NET, PHP and JSP files will be treated as `text/html`.

## TO-DO

- [x] Add `port`, `proxy`, `livereload` and `livereloadPort` config options (_v2.1.0_, thanks to [@howardh](https://github.com/howardh))
- [x] Remove `routes`. Now all requests are redirected to `remote_url` (_v2.0.0_)
- [x] Remove support for redirections to different remote paths (_v1.0.0_)
- [x] Support querystrings (_v0.0.9_)
- [x] Redirect local requests to different remote path (_v0.0.8_)
- [x] Implement error forwarding to local server from remote server (_v0.0.7_)
- [x] Better logging system (_v0.0.5_)

## Acknowledgments

The original idea behind *redirect-rest* was by [@drmillan](http://github.com/drmillan). He was planning on doing something much more simple, and written in some archaic and obscure language such as PHP.

I couldn't allow that `\_(ʘ_ʘ)_/`

## License

Copyright (c) 2014 Juan G. Hurtado
Licensed under the MIT license.
