var path = require('path');
var archive = require('../helpers/archive-helpers');
var utils = require('./http-helpers');
var fs = require('fs');
var urlParser = require('url'); 
// require more modules/folders here!

// =============== CURLS ================= //
// curl -X GET http://127.0.0.1:8080

// Object to deal with GET and POST requests
var actions = {
  'GET': function(req, res){

    var url = urlParser.parse(req.url);
    var target = (url.pathname === '/') ? '/index.html' :  url.pathname;
    utils.serveAssets(res, target);
      
  },
  'POST': function(req, res){
    console.log('POSTTT');
    res.end();
  }
}

exports.handleRequest = function (req, res) {
  
  // action coming from the request
  var action = actions[req.method];

  if (action) {
    action(req, res)
  } else {
    res.writeHead(404);
    res.end();
  }

};
