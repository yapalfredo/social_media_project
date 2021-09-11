//Initializing express library
const express = require('express')
//Importing the Router Module of express
const router = express.Router()
//Importing the Controller for user 
const userController = require('./controllers/userController')

//This is for HomePage
//Mini express app  ( replacement for app.get())
//Using a controller to make it cleaner
router.get('/', userController.home)

router.post('/SignUp', userController.signup)

//will make this js file available to be called
module.exports = router