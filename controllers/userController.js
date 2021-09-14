//import the User model

// const { resolveInclude } = require('ejs')
// const { render } = require('../app')
const User = require("../models/User")

exports.signup = function (req, res) {
  //creates a new User object, which then passess the req object
  //as an argument
  let user = new User(req.body)
  //this will call the singup() protype function of the new User object
  user
    .signup()
    .then(() => {
      req.session.user = { username: user.data.username, avatar: user.avatar }
      req.session.save(function () {
        res.redirect("/")
      })
    }) //catches any validations errors (array)
    .catch((signUpErrors) => {
      signUpErrors.forEach(function (e) {
        req.flash("signUpErrors", e)
      })
      req.session.save(function () {
        res.redirect("/")
      })
    })
}

//this controls the Login
exports.login = function (req, res) {
  let user = new User(req.body)

  //Normall, for using "Promise", you need to use ".then()" and ".catch()"
  user
    .login()
    .then(function () {
      //this will create the session
      req.session.user = { avatar: user.avatar, username: user.data.username }
      //this will trigger manually to save the session in db, then call back function when done saving
      //and redirect to appropriate page
      req.session.save(function () {
        res.redirect("/")
      })
    })
    .catch(function (e) {
      //req.session.flash.errors = e
      req.flash("errors", e)
      //manually tells session to save the data to db
      req.session.save(function () {
        // res.redirect('/')
        res.redirect("/")
      })
    })
}

exports.logout = function (req, res) {
  //will delete the session
  //then redirect to home
  req.session.destroy(function () {
    res.redirect("/")
  })
}

exports.home = function (req, res) {
  //this checks if session is present
  if (req.session.user) {
    //first argument is the name of the template.
    //second argument is the object you want to pass when logged in
    //the username will be accessible from the template 'home-dashboard'
    //the avatar will be accessible too
    //res.render("home-dashboard", { username: req.session.user.username, avatar: req.session.user.avatar })

    //No need of 2nd argument, since app res.locals is already implemented in app.js
    res.render("home-dashboard")
  } else {
    //this will make the error message available (from home-guest template) using flash, then deletes it after
    //getting called.

    res.render("home-guest", {
      errors: req.flash("errors"),
      signUpErrors: req.flash("signUpErrors"),
    })
  }
}

//This check if a visitor is logged in.
//This is required on some pages that require authentication.
//It restricts unauthenticated people from viewing secured pages
exports.isLoggedIn = function(req, res, next){
  //req.session.user is only created when a user is logged in
  if (req.session.user) {
    next()
  } else {
    req.flash('errors', "You must be logged in to view the page.")
    req.session.save(function(){
      res.redirect('/')
    })
  }
}
