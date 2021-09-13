//model is where we enforce the business logic

//npm install bcryptjs
//For hashing
const bcryptjs = require("bcryptjs")

//import the db.js
//selecting the collection 'users' from mongodb
//the '.db()' will initialize a database instance
const usersCollection = require("../db").db().collection("users")

//npm install validator
//this will make it easier to validate User input (e.g. email address)
const validator = require("validator")

//npm install md5
//we will be using this for retrieving passing our email to gravatar (hashed)
const md5 = require("md5")

//Constructor
let User = function (data) {
  // "this" is mandatory.
  // that way everytime a new constructor is called,
  // the appropriate object (in this case User) will be
  // created
  this.data = data
  this.errors = []
}

User.prototype.cleanUp = function () {
  // Get rid of any other fake properties

  if (typeof this.data.username != "string") {
    this.data.username = ""
  }
  if (typeof this.data.email != "string") {
    this.data.email = ""
  }
  if (typeof this.data.password != "string") {
    this.data.password = ""
  }
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password,
  }
}

// User input validation logic
//converted to a Promise / async / await
User.prototype.validate = function () {
  return new Promise(async (resolve, reject) => {
    // if (this.data.username == "" && this.data.email == "" && this.data.password == "" ) {
    //     this.errors.push("You must provide an username.")
    //     this.errors.push("You must provide an email")
    //     this.errors.push("You must provide a password.")
    // }
    if (this.data.username == "") {
      this.errors.push("You must provide an username.")
    }

    if (this.data.email == "") {
      this.errors.push("You must provide an email")
    }

    if (this.data.password == "") {
      this.errors.push("You must provide a password.")
    }

    if (this.data.email != "" && !validator.isEmail(this.data.email)) {
      this.errors.push("You must provide a valid email address.")
    }

    if (
      this.data.username != "" &&
      !validator.isAlphanumeric(this.data.username)
    ) {
      this.errors.push("Username can only contains letters and numbers.")
    }

    if (this.data.password.length > 0 && this.data.password.length < 12) {
      this.errors.push("Password must be atleast 12 characters")
    }

    //bcryptjs has a maximum password length of 50
    if (this.data.password.length > 50) {
      this.errors.push("Password cannot exceed 50 characters")
    }

    if (this.data.username.length > 0 && this.data.username.length < 8) {
      this.errors.push("Username must be atleast 8 characters")
    }

    if (this.data.username.length > 30) {
      this.errors.push("Username cannot exceed 30 characters")
    }

    // Only if username is valid then check if it's already taken
    if (
      this.data.username.length > 2 &&
      this.data.username.length < 31 &&
      validator.isAlphanumeric(this.data.username)
    ) {
      let usernameExists = await usersCollection.findOne({
        username: this.data.username,
      })
      if (usernameExists) {
        this.errors.push("The username is taken already")
      }
    }

    // Only if email is valid then check if it's already taken
    if (validator.isEmail(this.data.email)) {
      let emailExists = await usersCollection.findOne({
        email: this.data.email,
      })
      if (emailExists) {
        this.errors.push("The email address is taken already")
      }
    }
    resolve()
  })
}

//prototype makes sure that this function() this not get
//duplicated everytime a new User() model object is called.
//converted to a Promise / async / await
User.prototype.signup = function () {
  return new Promise(async (resolve, reject) => {
    //1st step - cleanUp and validate user input
    this.cleanUp()
    await this.validate()

    //2nd step - only if there are no input errors
    //then save the user input to the database
    if (!this.errors.length) {
      //hash user password
      let salt = bcryptjs.genSaltSync(10)
      this.data.password = bcryptjs.hashSync(this.data.password, salt)
      await usersCollection.insertOne(this.data)
      this.getAvatar()
      resolve()
    } else {
      reject(this.errors)
    }
  })
}

//User Login Model
User.prototype.login = function () {
  //Promise is the latest standard for asynchronus processing
  //arrow function doesn't manipulate the 'this' keyword
  //converted to a Promise
  return new Promise((resolve, reject) => {
    this.cleanUp()

    //CRUD (READ PART)
    //Converted to PROMISE
    usersCollection
      .findOne({ username: this.data.username })
      .then((requestedUser) => {
        //if there's a matching username
        //and if the password is correct

        //resolve and reject will send back to userController.js
        if (
          requestedUser &&
          bcryptjs.compareSync(this.data.password, requestedUser.password)
        ) {
          this.data = requestedUser
          this.getAvatar()
          resolve(true)
        } else {
          reject("Incorrect Username / Password !")
        }
      })
      .catch(function () {
        reject("There was an error during login ")
      })
  })
}

//Signed up in Gravatar for free account and uploaded an avatar
//this function will be used to fetch the gravator icon using the md5 encrypted email address
User.prototype.getAvatar = function () {
  this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`
}

module.exports = User
