var express = require("express");
var app = express();

app.set("port", (process.env.PORT || 5000));

app.get("/getPrintJobs", getPrintJobs);
 
app.listen(app.get("port"), function () {
    console.log("Now Listening for connections on port: ", app.get("port"));
});

function getPrintJobs(request, response) {
	console.log("Getting print jobs");
};