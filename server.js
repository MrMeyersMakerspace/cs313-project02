var express = require("express");
var app = express();

app.use(express.static("public"));

app.set("views", "views");
app.set("view engine", "ejs");

const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || "postgres://postgres:11235813@localhost:5432/project02"
const pool = new Pool({ connectionString: connectionString });

app.set("port", (process.env.PORT || 5000));

app.get("/admin", (request, response) => response.render('sortJobs'));

// Because we will be using post values, we need to use the body parser middleware
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

// Login Testing
app.get("/adminLogin", (request, response) => response.render('adminLogin'));

// Main print job submission page
app.get("/", (request, response) => response.render('submitPrintJob'));

// Successful print submission page
app.get("/success", (request, response) => response.render('success'));

// Gets options for print job submission page via AJAX
app.get("/getOptions", getOptions);

// User submits a print job
app.post("/submitPrintJob", submitPrintJob);

app.get("/getPrintJob/:jobid", getPrintJob);

app.get("/sortPrintJobs", sortPrintJobs);

app.listen(app.get("port"), function () {
    console.log("Now Listening for connections on port: ", app.get("port"));
});


///////////////////////////////////////

/*
// We are going to use sessions
var session = require('express-session')

// set up sessions
app.use(session({
  secret: 'my-super-secret-secret!',
  resave: false,
  saveUninitialized: true
}))
*/

// Setup our routes
app.post('/login', handleLogin);
app.post('/logout', handleLogout);

// Checks if the username and password match a hardcoded set
// If they do, put the username on the session
function handleLogin(request, response) {
    var result = { success: true };

    var username = request.body.username;
    var password = request.body.password;

    console.log("Username: " + username);
    console.log("Password: " + password);
    response.json(result);
    // We should do better error checking here to make sure the parameters are present
    /*
	if (request.body.username == "admin" && request.body.password == "password") {
		request.session.user = request.body.username;
		result = {success: true};
	}

    response.json(result);
    */
}

// If a user is currently stored on the session, removes it
function handleLogout(request, response) {
    var result = { success: true };

    /*
	// We should do better error checking here to make sure the parameters are present
	if (request.session.user) {
		request.session.destroy();
		result = {success: true};
	}
    */

    response.json(result);
}

// This is a middleware function that we can use with any request
// to make sure the user is logged in.
function verifyLogin(request, response, next) {
    /*
    if (request.session.user) {
		// They are logged in!

		// pass things along to the next function
		next();
	} else {
		// They are not logged in
		// Send back an unauthorized status
		var result = {success:false, message: "Access Denied"};
		response.status(401).json(result);
    }
    */
}

//////////////////////////////////////////

function submitPrintJob(request, response) {
    console.log("Submitting print job");

    var first = request.body.firstname;
    var last = request.body.lastname;
    var printname = request.body.printname;
    var source = Number(request.body.source);
    var use = Number(request.body.use);
    var color = Number(request.body.color);
    var material = Number(request.body.type);
    var filename = request.body.filename;
    var driveurl = request.body.url;
    var status = 1;
    // Get Current Date
    var timestamp = Date.now();
    var date_ob = new Date(timestamp);
    var day = date_ob.getDate();
    var month = date_ob.getMonth() + 1;
    var year = date_ob.getFullYear();
    var date = day + "-" + month + "-" + year;


    // Check values in console
    console.log("Firstname: " + first);
    console.log("Lastname: " + last);
    console.log("Print Name: " + printname);
    console.log("Source: " + source);
    console.log("Print Use: " + use);
    console.log("Color: " + color);
    console.log("Material: " + material);
    console.log("Filename: " + filename);
    console.log("Google Drive URL: " + driveurl);
    console.log("Job Status: " + status);
    console.log("Date: " + date);




    var sql =
    `INSERT INTO project02.printjob 
        (   firstname,
            lastname,
            printname,
            sourceid,
            useid,
            colorid,
            materialid,
            filename,
            driveurl,
            statusid,
            statusdate  )
    VALUES
        (   '${first}',
            '${last}',
            '${printname}',
            '${source}',
            '${use}',
            '${color}',
            '${material}',
            '${filename}',
            '${driveurl}',
            '${status}',
            '${date}')`;

    pool.query(sql, (error, result) => {
        if (error) {
            console.log("An error with the DB occurred");
            console.log(error);
        }

        console.log("Values Entered Successfully");

        response.redirect("/success");
    });

}

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

function getOptions(request, response) {
    console.log("Getting table options");

    var table = request.query.table;
    var sql;
    console.log("Retrieving table info from table: ", table);


    switch (table) {
        case "source":
            sql = 'SELECT * FROM project02.modelsource';
            break;
        case "use":
            sql = 'SELECT * FROM project02.printuse';
            break;
        case "color":
            sql = 'SELECT * FROM project02.color';
            break;
        case "type":
            sql = 'SELECT * FROM project02.printmaterial';
            break;
    }

    var params = [];

    pool.query(sql, params, function (error, result) {
        if (error) {
            console.log("An error with the DB occurred");
            console.log(error);
            callback(error, null);
        }

        console.log("Found DB result: " + JSON.stringify(result.rows));

        response.json(result.rows);
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
            sortVar = "js.statusID";
            break;
    }

    var sql =
        `SELECT *
    FROM project02.printJob pj
    JOIN project02.color c ON pj.colorID = c.colorID
    JOIN project02.jobStatus js ON pj.statusID = js.statusID
    JOIN project02.modelSource ms ON pj.sourceID = ms.sourceID
    JOIN project02.printMaterial pm ON pj.materialID = pm.materialID
    JOIN project02.printUse pu ON pj.useID = pu.useID
    ORDER BY ${sortVar}`;


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
