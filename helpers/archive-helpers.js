var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  var result;
  fs.readFile(exports.paths.list, function(err, list){
  	if (err) throw err;
  	result = list.toString().split('\n');
  	if (callback) { 
	  	callback(result) 
	};
  });
};

exports.isUrlInList = function(url, callback){
	url = url.slice(4);
	exports.readListOfUrls(function(sites) {
		var match = _.any(sites, function(site) {
			return site.match(url);
		});
		console.log('match', match);
		callback(match);
	});
};

exports.addUrlToList = function(url, callback){
  fs.appendFile(exports.paths.list, '\n' + url, function (err) {
    if (err) {
    	console.log('Error to append teh File');
    	throw err;
    }
    callback();
  });
};

exports.isURLArchived = function(url, callback){
	fs.exists(exports.paths.archivedSites + '/' + url, function(exists) {
		console.log('EXISSTSS', exists);
		callback(exists);
	})
};

exports.downloadUrls = function(){
};
