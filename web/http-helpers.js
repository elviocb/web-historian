var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};


exports.sendResponse = function(response, content, statusCode) {
	response.writeHead(statusCode || 200, headers);
	// console.log('content',content);
	response.end(content);
};

exports.sendRedirect = function(response, target, statusCode) {
	response.writeHead(statusCode || 302, {Location: target});
	console.log('IM HERE!!!!! setHeader');
	response.end();
};

exports.collectData = function(req, callback){
  var bufferToString = '';
   
  req.on('data', function(data) {
  	bufferToString += data;
  });

  req.on('end', function(){
    callback ? callback(bufferToString) : console.log('Callback Not provided');
  });
}

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
  var publicFilePath = archive.paths.siteAssets + asset;
  var archivesFilePath = archive.paths.archivedSites + asset;
  var encoding = {encoding: 'utf8'};
  
  // 1. Check the public 
  fs.readFile(publicFilePath, encoding, function(err, contents) {
  	
  	if (err) {
	  	// 2. If it's not in the public, check the archives
	  	fs.readFile(archivesFilePath, encoding, function(err, contents){
	  		if (err) {
	  		// 3. If it's not in the archives, send a 404
	  			callback ? callback() : exports.sendResponse(res, 'File not found', 404);
	  		} 
        // If it's in the archives, serves it
        exports.sendResponse(res, contents);
	  	});
  	} 
    // if it's in the public, serves it.
    exports.sendResponse(res, contents);

  });

};




// As you progress, keep thinking about what helper functions you can put here!
