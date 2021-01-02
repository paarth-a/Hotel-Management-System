const mysql = require("mysql");

// db configurations
const dbconf = require("../config/config.js");

var con = mysql.createConnection({
    host: dbconf.HOST,
    user: dbconf.USER,
    password: dbconf.PASSWORD,
    database: dbconf.DB
  });
  
  // test connection
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
  
  module.exports = con; 
