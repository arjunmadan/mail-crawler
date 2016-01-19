var Request  = require("request");
var Cheerio  = require("cheerio");
var mysql    = require("mysql");
var Q        = require("Q");

var baseUrl  = "http://" + process.argv[2] + ".markmail.org/search/?page=";
var count    = 0;
var msgCount = 0;
var IdList   = [];
var pageNo   = 1;

function getMessageCount() {

	var deferred = Q.defer();
	
	Request("http://" + process.argv[2] + ".markmail.org/", function (error, response, html) {
		if(!error && response.statusCode == 200) {
			var $ = Cheerio.load(html);
			var a = $("strong").next(function () {
				if(msgCount == 0) {
					msgCount = $(this).text();
					msgCount = parseInt(msgCount.replace(/,/g, ''), 10);
				}
			});
			console.log("Number of messages: " + msgCount);
			deferred.resolve();
		}
	});

	return deferred.promise;
}

function getEmailUrls() {

	var deferred = Q.defer();
	//var IdList = [];
	//Get all the message IDs from a page.
	Request(baseUrl + pageNo, function (error, response, html) {
		if(!error && response.statusCode == 200) {
			var $ = Cheerio.load(html);
			$("div.result").each(function(i, element){
				var a = $(this);
				IdList.push(a['0'].attribs.id);
			});
			pageNo = pageNo + 1;
			deferred.resolve();
		}
		else {
			console.log(error);
		}
	});

	return deferred.promise;
}

function getEmailContents() {

	while(IdList.length > 0) {
		msgId = IdList.pop();
		Request("http://markmail.org/message/" + msgId, function (error, response, html) {
			if(!error && response.statusCode == 200) {
				var $ = Cheerio.load(html);
				$("table#headers").children().children().each(function(i, element){
					var a = $(this);
					switch($(this).children('th').text()) {
						case 'From:':
							console.log("From: " + $(this).children('td').text());
							break;
						case 'Date:':
							console.log("Date: " + $(this).children('td').text());
							break;
						case 'Subject:':
							console.log("Subject: " + $(this).children('td').text());
							break;
						case 'List:':
							console.log("List: " + $(this).children('td').text());
							break;
						default:
							break;
					}
				});

				console.log($("div.messagebody").text());
			}
			else {
				console.log(error);
			}
		});
		if(IdList.length == 0) {
			deferred.resolve();
		}
	}

	return deferred.promise;
}
getMessageCount()
.then(getEmailUrls)
.then(getEmailContents);