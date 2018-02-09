const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");

var app = express();
const PORT = process.env.PORT || 5000;
// Connect to mongoose

mongoose.connect('mongodb://localhost/vidjot-dev')
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

app.use(flash())

// Global variables

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
})





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

// Idea index page
app.get('/ideas', (req, res) => {
    Idea.find({})
        .then(ideas => {
            res.render("ideas/index", {
                ideas: ideas
            })
        })
})

// Add Idea Form

app.get('/ideas/add', (req, res, next) => {
    res.render("ideas/add")
})

// Add Idea Form

app.get('/ideas/edit/:id', (req, res, next) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            res.render("ideas/edit", {
                idea: idea
            })

        })
})

// Add Ideas Form
app.post('/ideas', (req, res, next) => {
    let errors = [];
    if (!req.body.title)
        errors.push({ text: "Please add a title" })
    if (!req.body.details)
        errors.push({ text: "Please add  details" })
    if (errors.length > 0)
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })
    else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            // user: req.user.id
        }
        new Idea(newUser)
            .save()
            .then((idea) => {
                req.flash('success_msg', `Video idea Added`)
                res.redirect("/ideas")
            })
    }

})

// Edit Idea Form

app.put('/ideas/:id', (req, res, next) => {
    let errors = [];
    if (!req.body.title)
        errors.push({ text: "Please add a title" })
    if (!req.body.details)
        errors.push({ text: "Please add  details" })
    if (errors.length > 0)
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })
    else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            // user: req.user.id
        }
        Idea.findOne({
            _id: req.params.id
        })
            .then((idea) => {

                idea.title = req.body.title;
                idea.details = req.body.details;
                idea.save()
                    .then((idea) => {
                        req.flash('success_msg', `Video idea Updated`)
                        res.redirect("/ideas")
                    })
            })
    }

})

// Delete Idea
app.delete("/ideas/:id", (req, res, next) => {
    Idea.remove({
        _id: req.params.id
    })
        .then(() => {
            req.flash('success_msg', `Video idea removed`)
            res.redirect("/ideas")
        })
})

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
})