[Autodetect the `http` module
source](https://github.com/binki/http-autodetect) and delegate to a
Express app.

# Usage

    const expressHttpAutodetect = require('express-http-autodetect');
    const app = require('./app');
    
    expressHttpAutodetect(app);

# Mechanics

## `req.baseUrl`

The node [`http`](https://nodejs.org/api/http.html) module has no
concept of `baseUrl` because it assumes it will get to open the TCP
socket itself and just serve out pages at `/`. However, various
deployment strategies supported by
[`http-autodetect`](https://github.com/binki/http-autodetect) are
commonly used to deploy applications at URIs other than `/`. Thus
`http-autodetect` provides a `getBaseUrl(req)` function to discover
the baseUrl for the current request (in FastCGI, the necessary
information is not available until a request is received).

Express supports mounting applications at sub-paths. To enable mounted
applications to generate absolute URIs to resources within the apps,
it provide the
[`req.baseUrl`](https://expressjs.com/en/4x/api.html#req.baseUrl)
property. This enables the following to work sensibly:

    const express = require('express');
    
    const app = express();
    
    const subApp = express();
    subApp.get('/asdf', function (req, res) {
       // When mounted, will get /subApp/foo
      res.send(`Another resource on this app is ${req.baseUrl}/foo`);
    });
    subApp.get('/foo', function (req, res) {
      res.send(`You found me!`);
    });
    
    app.use('/subApp', subApp);
    app.listen(3000);

This module ensures that the passed app is treated like it is mounted
in an express app at the `baseUrl` calculated by
`http-autodetect`. This causes the `baseUrl` to be set properly for
the passed app and ensures that routing is performed relative to the
deployment `baseUrl`.