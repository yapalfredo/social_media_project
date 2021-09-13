//import the User model
const { resolveInclude } = require('ejs')
const { render } = require('../app')
const User = require('../models/User')

exports.signup = function(req, res){
    //creates a new User object, which then passess the req object
    //as an argument
   let user = new User(req.body)
   //this will call the singup() protype function of the new User object
   user.signup()
   //checks if there are any validations errors (array)
   if (user.errors.length > 0) {
        res.send(user.errors)
   } else {
        res.send("No errors found")
   }
}

//this controls the Login
exports.login = function(req, res){
     let user = new User(req.body)

     //Normall, for using "Promise", you need to use ".then()" and ".catch()"
     user.login().then(function(result){
          //this will create the session
          req.session.user = {favColor: "blue", username: user.data.username}
          //this will triggered manually; then call back function when done saving
          //and redirect
          req.session.save(function(){
               res.redirect('/')
          })
     }).catch(function(err){
          res.send(err)
     })
 }
 
 exports.logout = function(req, res){
      //will delete the session
      //then redirect to home
     req.session.destroy(function(){
          res.redirect('/')
     })
 }

exports.home = function(req, res){
     //this checks if session is present
    if (req.session.user) {
         //first argument is the name of the template.
         //second argument is the object you want to pass when logged in
         //the username will be accessible from the template 'home-dashboard'
          res.render('home-dashboard', {username: req.session.user.username})
    } else {
          res.render('home-guest')
    }
}