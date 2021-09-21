//Initializing express library
const express = require('express')
//Importing the Router Module of express
const router = express.Router()
//Importing the Controller for user 
const userController = require('./controllers/userController')
//Import the Controler for posting
const postController = require('./controllers/postController')
//Import the Controler for follow
const followController = require('./controllers/followController')

//This is for HomePage
//Mini express app  ( replacement for app.get())
//Using a controller to make it cleaner
router.get('/', userController.home)

//USERS RELATED ROUTES
router.post('/signUp', userController.signup)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

//PROFILE RELATED ROUTES
router.get('/profile/:username', userController.ifUserExists, userController.sharedProfileData, userController.profilePostsScreen)
router.get('/profile/:username/followers', userController.ifUserExists, userController.sharedProfileData, userController.profileFollowersScreen)
router.get('/profile/:username/following', userController.ifUserExists, userController.sharedProfileData, userController.profileFollowingScreen)
router.post('/isUsernameExisting', userController.isUsernameExisting) //LIVE FORM VALIDATION 
router.post('/isEmailExisting', userController.isEmailExisting) //LIVE FORM VALIDATION 

//POSTING RELATED ROUTES
//userController.isLoggedIn function prevents unauthenticated user from trying to access protected page
router.get('/create-post', userController.isLoggedIn, postController.viewCreateScreen)
router.post('/create-post', userController.isLoggedIn, postController.createPost)
router.get('/post/:id', postController.viewSingle)
router.get('/post/:id/edit', userController.isLoggedIn, postController.viewEditScreen)
router.post('/post/:id/edit', userController.isLoggedIn, postController.edit)
router.post('/post/:id/delete', userController.isLoggedIn, postController.delete)
router.post('/search', postController.search)

//FOLLOW RELATED ROUTES
router.post('/addFollow/:username', userController.isLoggedIn, followController.addFollow)
router.post('/removeFollow/:username', userController.isLoggedIn, followController.removeFollow)

//will make this js file available to be called
module.exports = router