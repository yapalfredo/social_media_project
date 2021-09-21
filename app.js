//This is where we enable new features within our express application

//npm install express
const express = require('express')
//npm install express-session
const session = require('express-session')
//npm install connect-mongo (this allows you
//save sessions to MongoDB instead of locally
//in the browser)
const MongoStore = require('connect-mongo')
//npm install connect-flash
//implements a red/error box (flash message)
const flash = require('connect-flash')
//npm install marked
//This will allow a safe user generated html in the post
const markdown = require('marked')
//npm install sanitize-html
//this will make sure that all inserted characters in post are safe
const sanitizeHTML = require('sanitize-html')
//npm install csurf
const csrf = require('csurf')
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

//tell express to use flash
app.use(flash())

//we tell express to run this function for every request
//this will be available to all ejs templates
app.use(function(req, res, next){
    //make our markdown function available to all ejs templates
    res.locals.filterPostHTML = function(content){
        return sanitizeHTML(markdown(content), {allowedTags: ['p','br','ul','ol','li','strong','bold','i', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'], allowedAttributes: {}})
    }
    
    //make all error and success flash messages available to all templates
    res.locals.errors = req.flash("errors")
    res.locals.success = req.flash("success")
    //Make current user id available on the req object
    if (req.session.user){req.visitorId = req.session.user._id} else {req.visitorId = 0}
    //Make user session data available from with view templates
    res.locals.user = req.session.user
    next()
})

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

//csrfToken
app.use(csrf())
//csrf middleware making the csrftoken available 
//to our ejs templates
app.use(function(req, res, next) {
    res.locals.csrfToken = req.csrfToken()
    next()
  })

//HomePage
app.use('/', router)

//csrf error handling
app.use(function(err, req, res, next) {
    if(err){
        if(err.code == "EBADCSRFTOKEN") {
            req.flash('errors', 'Cross-Site Request Forgery Detected')
            req.session.save(() => res.redirect('/'))
        } else {
            res.render('404')
        }
    }
})

const server = require('http').createServer(app)
const io = require('socket.io')(server)

//making the express session data available from with in
//the context of socket.io
io.use((socket, next)=>{
    sessionOptions(socket.request, socket.request.res, next)
})

io.on('connection', function(socket){
    if (socket.request.session.user) {
        let user = socket.request.session.user

        socket.emit('welcome', {username: user.username, avatar: user.avatar})

        socket.on('chatMessageFromBrowser', function(data){
            //this will emit the message to all users in the browsers except for the sender
            socket.broadcast.emit('chatMessageFromServer', {message: sanitizeHTML(data.message, {allowedTags: [], allowedAttributes: {}}), username: user.username, avatar: user.avatar})
        })
    }
})

//app.listen(3000)
//export the app instead of listening on this file, so that it can't be access (db.js)
module.exports = server