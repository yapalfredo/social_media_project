//import the User model
const User = require('../models/User')


exports.login = function(){
    
}

exports.logout = function(){
    
}

exports.signup = function(req, res){
   let user = new User(req.body)
   user.signup()
}

exports.home = function(req, res){
    res.render('home-guest')
}