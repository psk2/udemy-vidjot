const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const path = require("path") 
const passport = require("passport")

// Configuring DB.
const db = require("./config/database")

const ideasRoutes = require("./routes/ideas")
const userRoutes = require("./routes/users")


// Passport config
require("./config/passport")(passport);

var app = express();
const PORT = process.env.PORT || 5000;
// Connect to mongoose

mongoose.connect(db.mongoURI)
    .then(() => console.log("MongoDB Connected."))
    .catch(err => console.log('err', err))

// Load Mongoose Modules.

require("./models/Idea")
const Idea = mongoose.model("ideas")

// HandleBars middleware.

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser Middleware

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Method override middleware
app.use(methodOverride("_method"))

// Express Session Middleware 
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}))

// Passport Middleware

app.use(passport.initialize());
app.use(passport.session());


app.use(flash())

//  Static folder

app.use(express.static(path.join(__dirname,"public")))


// Global variables

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null
    next();
})


/* *****************ROUTES*********************** */


// Index Route

app.get('/', (req, res, next) => {
    const indexTitle = "Hellaaa.."
    res.render("index", {
        title: indexTitle
    })
})

// About page
app.get('/about', (req, res, next) => {
    res.render("about")
})

// Idea Routes.
app.use('/ideas', ideasRoutes)
app.use('/users', userRoutes)


/* **************************************** */


app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
})