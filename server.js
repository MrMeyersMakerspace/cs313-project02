var express = require("express");
var app = express();

const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || "postgres://postgres:11235813@localhost:5432/project02"
const pool = new Pool({ connectionString: connectionString });

app.set("port", (process.env.PORT || 5000));

app.get("/getPrintJob/:jobid", getPrintJob);
 
app.listen(app.get("port"), function () {
    console.log("Now Listening for connections on port: ", app.get("port"));
});

function getPrintJob(request, response) {
    console.log("Getting print job");

    var jobid = request.params.jobid;
    console.log("Retrieving print job with id: ", jobid);

    getPrintJobFromDb(jobid, function (error, result) {
        if (error || result == null || result.length != 1) {
            response.status(500).json({ success: false, data: error });
        } else {
            console.log("Back from the getPrintJobFromDb function with results: ", result);
            response.json(result[0]);
        }
    });

}

function getPrintJobFromDb(jobid, callback) {
    console.log("getPersonFromDb called with id ", jobid);

    var sql = "SELECT * FROM project02.printJob WHERE jobid = $1::int";
    var params = [jobid];

    pool.query(sql, params, function (error, result) {
        if (error) {
            console.log("An error with the DB occurred");
            console.log(error);
            callback(error, null);
        }

        console.log("Found DB result: " + JSON.stringify(result.rows));

        callback(null, result.rows);
    });
}