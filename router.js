//Initializing express library
const express = require('express')
//Importing the Router Module of express
const router = express.Router()
//Importing the Controller for user 
const userController = require('./controllers/userController')
//Import the Controler for posting
const postController = require('./controllers/postController')

//This is for HomePage
//Mini express app  ( replacement for app.get())
//Using a controller to make it cleaner
router.get('/', userController.home)

//USERS RELATED ROUTES
router.post('/signUp', userController.signup)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

//POSTING RELATED ROUTES
//userController.isLoggedIn function prevents unauthenticated user from trying to access protected page
router.get('/create-post', userController.isLoggedIn, postController.viewCreateScreen)


//will make this js file available to be called
module.exports = router