//Importing the Router Module of express
const apiRouter = require('express').Router()
//Importing the Controller for user 
const userController = require('./controllers/userController')
//Import the Controler for posting
const postController = require('./controllers/postController')
//Import the Controler for follow
const followController = require('./controllers/followController')

apiRouter.post('/login', userController.apiLogin)

module.exports = apiRouter