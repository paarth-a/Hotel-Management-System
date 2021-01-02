const express = require("express");
const bodyParser = require("body-parser");
const session=require('express-session');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// bodyparser
app.use(express.json());

app.use(cookieParser());

// allow credentials (cookies) to { origin }
app.use(cors({ credentials: true, origin: 'http://localhost:4200' }));

// logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`)
  next();
})

// // simple route
// app.get("/", (req, res) => {
  
//   //  res.sendFile(path.join(__dirname + '/login.html')); (THIS IS FOR THE FRONT END LOGIN)
//   res.json({ message: "Welcome to the hotel management system." }); // display this for now
// });

require("./routes/user.routes.js")(app);
require("./routes/login.routes.js")(app);
require("./routes/admin.routes.js")(app);

// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.".blue);
});
//create express app

