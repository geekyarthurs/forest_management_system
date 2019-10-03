const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const app = express();
const flash = require("connect-flash");
const router = require("./routes/router");


app.use(morgan("dev"));
let sessionOptions = session({
  secret: "Javascript is fucking awesome bitch",
  resave: false,

  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
});
app.use(sessionOptions);
app.use(function(req,res, next) {
    res.locals.user = req.session.user
    next()
})

app.use(flash());

//Accepting Submitted Datas
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(express.json());

//Static Files
app.use(express.static("public"));

//Views
app.set("views", __dirname + '/views');
app.set("view engine", "ejs");

app.use("/", router);



module.exports = app;
