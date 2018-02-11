const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { ensureAuthenticated } = require("../helpers/auth")

require("../models/Idea")
const Idea = mongoose.model("ideas")



// Idea index page
router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({ user: req.user.id })
        .then(ideas => {
            res.render("ideas/index", {
                ideas: ideas
            })
        })
})

// Add Idea Form

router.get('/add', ensureAuthenticated, (req, res, next) => {
    res.render("ideas/add")
})

// Add Idea Form

router.get('/edit/:id', ensureAuthenticated, (req, res, next) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            if(idea.user !== req.user.id){
                req.flash("success_msg","Not Authorized")
                res.redirect("/ideas")
            }
            else {
                res.render("ideas/edit", {
                    idea: idea
                })
            }

        })
})

// Add Ideas Form
router.post('/', ensureAuthenticated, (req, res, next) => {
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
            user: req.user.id
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

router.put('/:id', ensureAuthenticated, (req, res, next) => {
    let errors = [];
    if (!req.body.title)
        errors.push({ text: "Please add a title" })
    if (!req.body.details)
        errors.push({ text: "Please add  details" })
    if (errors.length > 0)
        res.render('/ideas/add', {
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
router.delete("/:id", ensureAuthenticated, (req, res, next) => {
    Idea.remove({
        _id: req.params.id
    })
        .then(() => {
            req.flash('success_msg', `Video idea removed`)
            res.redirect("")
        })
})




module.exports = router;