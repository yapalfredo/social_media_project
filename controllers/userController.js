//import the User model
const User = require('../models/User')


exports.login = function(){
    
}

exports.logout = function(){
    
}

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

exports.home = function(req, res){
    res.render('home-guest')
}