var Bluebird = require("bluebird");
var Request  = Bluebird.promisify(require("request"));

var url = process.argv[2];

Request(url)
.then(function (result) {
	console.log(result);
})
.catch(function (error) {
	console.log(error);
})


