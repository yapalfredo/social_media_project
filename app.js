//npm install express
const express = require('express')
//npm install express-session
const session = require('express-session')
//npm install connect-mongo (this allows you
//save sessions to MongoDB instead of locally
//in the browser)
const MongoStore = require('connect-mongo')
const app = express()

//settings to enable sessions
let sessionOptions = session({
    secret: "JS is weird",
    //set the store location to MongoDB
    store: new MongoStore({client: require('./db')}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24, httpOnly: true}
})
//tell express to use sessions
app.use(sessionOptions)

//Router should only have list of routes
const router = require('./router')

//This tells express to add submitted data, from html form, to the 'req' object,
//So that it can be assessed from req.body
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//This will make public folder accessible without typing the folder name
//for paths
app.use(express.static('public'))

//---------TEMPLATE ENGINE------------------
//first argument should be 'views'
//second argument is the name of the folder
app.set('views', 'views')
//first argument should be 'view engine'
//second argument is 'ejs' (npm install ejs)
app.set('view engine', 'ejs')

//HomePage
app.use('/', router)

//app.listen(3000)
//export the app instead of listening on this file, so that it can't be access (db.js)
module.exports = app