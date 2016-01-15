var Bluebird = require("bluebird");
var Request  = Bluebird.promisify(require("request"));

var baseURL = "http://" + process.argv[2] + ".markmail.org/search/?page=";
var count = 1;

Request(baseURL + count)
.then(function (result) {
	console.log(result);
})
.catch(function (error) {
	console.log(error);
})


