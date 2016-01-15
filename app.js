var Request  = require("request");
var Cheerio  = require("cheerio");

var baseUrl = "http://" + process.argv[2] + ".markmail.org/search/?page=";
var count   = 1;
var IdList  = [];

function getEmailUrls(baseUrl, count) {
	
	Request(baseUrl + count, function (error, response, html) {
		if(!error && response.statusCode == 200) {
			var $ = Cheerio.load(html);
			$("div.result").each(function(i, element){
				var a = $(this);
				//console.log(a['0'].attribs.id);
				IdList.push(a['0'].attribs.id);
				count++;
    		});
		}
		console.log(IdList);
	});
	

}

getEmailUrls(baseUrl, count);

