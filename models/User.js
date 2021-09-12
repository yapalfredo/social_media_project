//model is where we enforce the business logic

//import the db.js
//selecting the collection 'users' from mongodb
const usersCollection = require('../db').collection("users")

//npm install validator
//this will make it easier to validate User input (e.g. email address)
const validator = require("validator")

//Constructor
let User = function(data){
    // "this" is mandatory.
    // that way everytime a new constructor is called,
    // the appropriate object (in this case User) will be
    // created
   this.data = data
   this.errors = []
}

User.prototype.cleanUp = function(){
    if (typeof(this.data.username ) != "string") {
        this.data.username = ""
    }
    if (typeof(this.data.email ) != "string") {
        this.data.email = ""
    }
    if (typeof(this.data.password ) != "string") {
        this.data.password = ""
    }

    // Get rid of any other fake properties
    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }
}

// User input validation logic
User.prototype.validate = function(){
    if (this.data.username == "" ) {
        this.errors.push("You must provide a username.")
    }
    if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {
        this.errors.push("Username can only contains letters and numbers.")
    }
    if (!validator.isEmail(this.data.email)) {
        this.errors.push("You must provide a valid email address.")
    }
    if (this.data.password == "" ) {
        this.errors.push("You must provide a password.")
    }
    if (this.data.password.length > 0 && this.data.password.length < 12) {
        this.errors.push("Password must be atleast 12 characters")
    }
    if (this.data.password.length > 100) {
        this.errors.push("Password cannot exceed 100 characters")
    }
    if (this.data.username.length > 0 && this.data.username.length < 8) {
        this.errors.push("Username must be atleast 8 characters")
    }
    if (this.data.username.length > 30) {
        this.errors.push("Username cannot exceed 30 characters")
    }
}

//prototype makes sure that this function() this not get
//duplicated everytime a new User() model object is called.
User.prototype.signup = function(){
    //1st step - cleanUp and validate user input
    this.cleanUp()
    this.validate()

    //2nd step - only if there are no input errors
    //then save the user input to the database
    if (!this.errors.length) {
        usersCollection.insertOne(this.data)
    }
}

//User Login Model
User.prototype.login = function(){
    //Promise is the lates standard for asynchronus processing

    //arrow function doesn't manipulate the 'this' keyword
   return new Promise((resolve, reject) => {
    this.cleanUp()

    //CRUD (READ PART)  
    //Converted to PROMISE
    usersCollection.findOne({username: this.data.username}).then((requestedUser) => {
         //if there's a matching username
        //and if the password is correct
        if (requestedUser && requestedUser.password == this.data.password){
            resolve(true)
        } else{
            reject(false)
        }
    }).catch(function(){
        reject(false)
    })
   })
}

module.exports = User