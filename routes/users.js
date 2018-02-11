const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const passport = require("passport")


require("../models/User")
const User = mongoose.model("users")


// User Login Route
router.get("/login", (req, res, next) => {
    res.render("users/login")
})

// User Registration Route
router.get("/register", (req, res, next) => {
    res.render("users/register")
})

// Login form POST
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/ideas",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next);
})

// Registration form POST
router.post("/register", (req, res, next) => {
    let errors = [];
    if (req.body.password !== req.body.confirmPassword)
        errors.push({
            text: "Passwords do not match."
        })
    if (req.body.password.length < 4)
        errors.push({
            text: "Passwords must be atleast 4 characters."
        })
    if (errors.length > 0) {
        res.render("users/register", {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        })
    }
    else {
        User.findOne({
            email: req.body.email
        })
            .then(user => {
                if (user) {
                    req.flash("success_msg", "Email Already exists")
                    res.redirect("/users/register")
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    })
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash("success_msg", "You are now registered and can log in")
                                    res.redirect("/users/login")
                                })
                                .catch(err => {
                                    console.log('err', err)
                                    return;
                                })
                        })
                    });
                }
            })
    }

})


// Logout User

router.get("/logout", (req,res,next) => {
    req.logout();
    req.flash("success_msg", "You are logged out")
    res.redirect("/users/login")
})

module.exports = router;