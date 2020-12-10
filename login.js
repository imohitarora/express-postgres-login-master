var Pool = require("pg").Pool;
var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");

var connection = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres",
  port: 5432,
});

var app = express();
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", function (request, response) {
  response.sendFile(path.join(__dirname + "/login.html"));
});

app.get("/register", function (request, response) {
  response.sendFile(path.join(__dirname + "/register.html"));
});

app.post("/auth", function (request, response) {
  var username = request.body.username;
  var password = request.body.password;
  if (username && password) {
    connection.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password],
      function (error, results, fields) {
        console.log("error", error);
        console.log("results", results);
        if (results.rows.length > 0) {
          request.session.loggedin = true;
          request.session.username = username;
          response.redirect("/home");
        } else {
          response.send("Incorrect Username and/or Password!");
        }
        response.end();
      }
    );
  } else {
    response.send("Please enter Username and Password!");
    response.end();
  }
});

app.post("/register", function (request, response) {
  var username = request.body.username;
  var password = request.body.password;
  var firstname = request.body.password;
  var lastname = request.body.password;
  var email = request.body.password;
  const qs =
    "INSERT INTO users(username, email, firstname, lastname, password) VALUES($1, $2, $3, $4, $5) RETURNING *";
  const values = [username, email, firstname, lastname, password];
  if (username && password && email && firstname && lastname) {
    connection.query(qs, values, function (error, results, fields) {
      console.log("error", error);
      console.log("results", results);
      if (results.rows.length > 0) {
        request.session.loggedin = true;
        request.session.username = username;
        response.redirect("/");
      } else {
        response.send("Error occur while registering! Contact admin.");
      }
      response.end();
    });
  } else {
    response.send("Please enter complete details!");
    response.end();
  }
});

app.get("/home", function (request, response) {
  if (request.session.loggedin) {
    response.send("Welcome back, " + request.session.username + "!");
  } else {
    response.send("Please login to view this page!");
  }
  response.end();
});

app.listen(3000);
