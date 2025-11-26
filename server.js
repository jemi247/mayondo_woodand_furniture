// 1. Dependencies
const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const passport = require('passport');
const expressSession = require("express-session")({
  secret:"secret",
  resave:false,
  saveUninitialized:false,
});
require('dotenv').config();

// import registration model
const Registration = require ("./models/Registration")

// import routes
const indexRoutes = require("./routes/indexRoutes");
const stockRoutes = require("./routes/stockRoutes");
const authRoutes = require("./routes/authRoutes");
const salesRoutes = require("./routes/salesRoutes");

// 2. Instantiations
const app = express();
const port = 3003;

// 3. Configurations
// setting up database connections
mongoose.connect(process.env.MONGO_URI);
mongoose.connection
  .once("open",()=> {
    console.log("mongoose connection open");
  })
  .on("error", (error)=> {
    console.error(`connection error: ${error.message}`);
  });

  // set view engine to pug
app.set('view engine', 'pug'); // setting pug as the view engine
app.set('views', path.join(__dirname, 'views')); // specifying the views directory

// 4. Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use('/public/images/uploads', express.static(__dirname + '/public/images/uploads'));

// express session configs
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

// global variables to be accessed by all views
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user;
  next();
});

// passport configs
passport.use(Registration.createStrategy());
passport.serializeUser(Registration.serializeUser());
passport.deserializeUser(Registration.deserializeUser());

// // 5. Routes
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/html/landing.html');
// });

// duplicate listen removed; final app.listen is at the bottom using `port`

app.use('/', indexRoutes);  // use imported routes
app.use('/', stockRoutes);  // use imported routes
app.use('/', authRoutes); // use imported routes
app.use('/', salesRoutes); 

// handling non-existent routes
app.use((req, res) => {
  res.status(404).send('Oops! Route Not Found.');
});

// 6. Bootstrapping server
//should always be the last line in your file
app.listen(port, () => console.log(`listening on port ${port}`));