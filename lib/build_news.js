var marky = require("marky-markdown");
var request = require('request');
var async = require('async');

function build_news(entry, callback) {
    var package = entry.package;

    var news_files = [
	'NEWS.md', 'NEWS.markdown', 'NEWS',
	'inst/NEWS.md', 'inst/NEWS.markdown', 'inst/NEWS',
    ];

    var md = null;

    async.detectSeries(
	news_files,
	function(item, callback) {
	    var url = 'https://raw.githubusercontent.com/cran/' + package +
		'/master/' + item;
	    request(url, function(error, response, body) {
		var ok = !error && response.statusCode == 200;
		if (ok) { md = body; }
		callback(ok);
	    })
	},
	function(result) {
	    if (result) {
		do_markdown(md, callback);
	    } else {
		console.log(package + " no NEWS file");
		callback(null, "");
	    }
	}
    )
}

function do_markdown(md, callback) {
    var html = marky(md).html();
    callback(null, html);
}

module.exports = build_news;
