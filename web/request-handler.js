var path = require('path');
var archive = require('../helpers/archive-helpers');
var utils = require('./http-helpers');
var fs = require('fs');
var urlParser = require('url'); 
// require more modules/folders here!

// =============== CURLS ================= //
// curl -X GET http://127.0.0.1:8080
// curl -X POST http://127.0.0.1:8080 -d "url=www.uol.com.br"

// Object to deal with GET and POST requests
var actions = {
  'GET': function(req, res){
    console.log('NEW GET', req.url);
    var url = urlParser.parse(req.url);
    var target = (url.pathname === '/') ? '/index.html' :  url.pathname;
    utils.serveAssets(res, target);
      
  },
  'POST': function(req, res){
    console.log('POSTTT');
    // Collect the POST data (url)
    utils.collectData(req, function(siteUrl){
      var url = siteUrl.slice(4);
      console.log('siteUrlllll', url);
      // check if the siteUrl is in the list
      archive.isUrlInList(url, function(answer){
        // site exists in sites.txt ?
        if (answer) {
          console.log('isUrlInList ? YESS!');
          // site is archived ?
          archive.isURLArchived(url, function(exists){
            if (exists) { // if yes
              // display the site
              console.log('isURLArchived ? exists!');
              utils.sendRedirect(res, '/' + url);
            } else {// if no
              // redirect to loading
              console.log('isURLArchived ? doesnt exist! :('); 
              utils.sendRedirect(res, '/loading.html');
            }
          });
        } else { // if it doesn't exist
          console.log('isUrlInList ? NOOO!');
          // append the search to sites.txt
          archive.addUrlToList(url, function(){
            // redirect to loading 
            console.log('Redirecting');
            utils.sendRedirect(res, '/loading.html'); 
          });
        }

      });
    });
    res.end();
  }
}

exports.handleRequest = function (req, res) {
  
  // action coming from the request
  var action = actions[req.method];

  if (action) {
    action(req, res)
  } else {
    utils.sendResponse(res, 'Not Found', 404);
  }

};
