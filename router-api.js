//Importing the Router Module of express
const apiRouter = require('express').Router()
//Importing the Controller for user 
const userController = require('./controllers/userController')
//Import the Controler for posting
const postController = require('./controllers/postController')
//npm install cors
const cors = require('cors')

//This will allow the apiRouter to use CORS library
apiRouter.use(cors())

apiRouter.post('/login', userController.apiLogin)
apiRouter.post('/create-post', userController.apiIsLoggedIn, postController.apiCreatePost)
apiRouter.delete('/post/:id', userController.apiIsLoggedIn, postController.apiDeletePost)
apiRouter.get('/postsByAuthor/:username', userController.apiGetPostsByUsername)

module.exports = apiRouter