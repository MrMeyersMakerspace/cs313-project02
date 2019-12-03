var express = require("express");
var app = express();

app.use(express.static("public"));

app.set("views", "views");
app.set("view engine", "ejs");

const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || "postgres://postgres:11235813@localhost:5432/project02"
const pool = new Pool({ connectionString: connectionString });

app.set("port", (process.env.PORT || 5000));

app.get("/", (request, response) => response.render('sortJobs'));

app.get("/getPrintJob/:jobid", getPrintJob);

app.get("/sortPrintJobs", sortPrintJobs);

app.listen(app.get("port"), function () {
    console.log("Now Listening for connections on port: ", app.get("port"));
});

function sortPrintJobs(request, response) {
    var sortType = request.query.sortType;
    console.log(sortType);

    getPrintJobsFromDb(sortType, function (error, result) {
        if (error || result == null) {
            response.status(500).json({ success: false, data: error });
        } else {
            console.log("Back from the getPrintJobsFromDb function with results: ", result);
            response.json(result);
        }
    });
}

function getPrintJob(request, response) {
    console.log("Getting print job ");

    var jobid = request.params.jobid;
    console.log("Retrieving print job with id: ", jobid);

    getPrintJobFromDb(jobid, function (error, result) {
        if (error || result == null || result.length != 1) {
            response.status(500).json({ success: false, data: error });
        } else {
            console.log("Back from the getPrintJobFromDb function with results: ", result);
            response.json(result);
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

function getPrintJobsFromDb(sortType, callback) {
    console.log("getPrintJobsFromDb called with sortType ", sortType);
    var sortVar;

    // Change order of values based on sort type
    switch (sortType) {
        case "first":
            sortVar = "firstName";
            break;
        case "last":
            sortVar = "lastName";
            break;
        case "print":
            sortVar = "printName";
            break;
        case "status":
            sortVar = "statusID";
            break;
    }

    var sql = `SELECT * FROM project02.printJob ORDER BY ${sortVar}`;

    var params = [];

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
