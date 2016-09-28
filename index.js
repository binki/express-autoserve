/* -*- mode: js2; indent-tabs-mode: nil; -*- */
'use strict';

var express = require('express');
var httpAutodetect = require('autoserve');

module.exports = function (app) {
    var mountApp = express();
    var mounted = {};
    httpAutodetect(function (req, res, next) {
        var baseUrl = httpAutodetect.getBaseUrl(req);
        console.log('found baseUrl=' + baseUrl);
        if (!mounted[baseUrl]) {
            mounted[baseUrl] = true;
            mountApp.use(baseUrl, app);
        }
        return mountApp.apply(this, arguments);
    });
};
