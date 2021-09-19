// const { resolveInclude } = require('ejs')
// const { render } = require('../app')
//import the User model
const User = require("../models/User")
//import the Post model
const Post = require("../models/Post")
//import the Follow model
const Follow = require("../models/Follow")

exports.sharedProfileData = async function(req, res, next){
  let isVisitorsProfile = false
  let isFollowing = false
  if(req.session.user){
    isVisitorsProfile = req.profileUser._id.equals(req.session.user._id)
    isFollowing = await Follow.isVisitorFollower(req.profileUser._id, req.visitorId)
  }

  req.isVisitorsProfile = isVisitorsProfile
  req.isFollowing = isFollowing

  // retrieve post, follower, and following count
  let postsCountPromise = Post.countPostsByAuthor(req.profileUser._id)
  let followersCountPromise = Follow.countFollowersById(req.profileUser._id)
  let followingCountPromise = Follow.countFollowingById(req.profileUser._id)
  //array destructuring
  let [postsCount, followersCount, followingCount] = await Promise.all([postsCountPromise, followersCountPromise, followingCountPromise])
  
  req.postsCount = postsCount
  req.followersCount = followersCount
  req.followingCount = followingCount

  next()
}

exports.signup = function (req, res) {
  //creates a new User object, which then passess the req object
  //as an argument
  let user = new User(req.body)
  //this will call the singup() protype function of the new User object
  user
    .signup()
    .then(() => {
      req.session.user = { username: user.data.username, avatar: user.avatar, _id: user.data._id }
      req.session.save(function () {
        res.redirect("/")
      })
    }) //catches any validations errors (array)
    .catch((signUpErrors) => {
      signUpErrors.forEach(function (e) {
        req.flash("signUpErrors", e)
      })
      req.session.save(function () {
        res.redirect("/")
      })
    })
}

//this controls the Login
exports.login = function (req, res) {
  let user = new User(req.body)

  //Normall, for using "Promise", you need to use ".then()" and ".catch()"
  user
    .login()
    .then(function () {
      //this will create the session
      //id is need to capture the user and save its id when new post is created under that account
      req.session.user = { avatar: user.avatar, username: user.data.username, _id: user.data._id }
      //this will trigger manually to save the session in db, then call back function when done saving
      //and redirect to appropriate page
      req.session.save(function () {
        res.redirect("/")
      })
    })
    .catch(function (e) {
      //req.session.flash.errors = e
      req.flash("errors", e)
      //manually tells session to save the data to db
      req.session.save(function () {
        // res.redirect('/')
        res.redirect("/")
      })
    })
}

exports.logout = function (req, res) {
  //will delete the session
  //then redirect to home
  req.session.destroy(function () {
    res.redirect("/")
  })
}

exports.home = async function (req, res) {
  //this checks if session is present
  if (req.session.user) {
    //first argument is the name of the template.
    //second argument is the object you want to pass when logged in
    //the username will be accessible from the template 'home-dashboard'
    //the avatar will be accessible too
    //res.render("home-dashboard", { username: req.session.user.username, avatar: req.session.user.avatar })

    //No need of 2nd argument, since app res.locals is already implemented in app.js

    //Fetch the feed of posts for logged in user
    let posts = await Post.getFeed(req.session.user._id)

    res.render("home-dashboard", {posts: posts})
  } else {
    //this will make the error message available (from home-guest template) using flash, then deletes it after
    //getting called.

    res.render("home-guest", {signUpErrors: req.flash("signUpErrors"),
    })
  }
}

//This check if a visitor is logged in.
//This is required on some pages that require authentication.
//It restricts unauthenticated people from viewing secured pages
exports.isLoggedIn = function(req, res, next){
  //req.session.user is only created when a user is logged in
  if (req.session.user) {
    next()
  } else {
    req.flash('errors', "You must be logged in to view the page.")
    req.session.save(function(){
      res.redirect('/')
    })
  }
}

//This is used when accessing a profile, then checking if the username exists

exports.ifUserExists = function(req, res, next){
  User.findByUsername(req.params.username).then(function(userDocument){
    req.profileUser = userDocument
    next()
  }).catch(function(){
    res.render("404")
  })
}

exports.profilePostsScreen = function(req, res){
  // ask our post model for posts by a certain author id
  Post.findByAuthorById(req.profileUser._id).then(function(posts){
    res.render('profile', {
      currentPage: "posts",
      posts: posts,
      profileUsername: req.profileUser.username,
      profileAvatar: req.profileUser.avatar,
      isFollowing: req.isFollowing,
      isVisitorsProfile: req.isVisitorsProfile,
      counts: {postsCount: req.postsCount, followersCount: req.followersCount, followingCount: req.followingCount}
    })
  }).catch(function(){
    res.render("404")
  })
}

exports.profileFollowersScreen = async function(req, res){
  try {
    let followers = await Follow.getFollowersById(req.profileUser._id)
    res.render('profile-followers', {
      currentPage: "followers",
      followers: followers,
      profileUsername: req.profileUser.username,
      profileAvatar: req.profileUser.avatar,
      isFollowing: req.isFollowing,
      isVisitorsProfile: req.isVisitorsProfile,
      counts: {postsCount: req.postsCount, followersCount: req.followersCount, followingCount: req.followingCount}
    })
  }catch {
    res.render("404")
  }
}

exports.profileFollowingScreen = async function(req, res){
  try {
    let following = await Follow.getFollowingById(req.profileUser._id)
    res.render('profile-following', {
      currentPage: "following",
      following: following,
      profileUsername: req.profileUser.username,
      profileAvatar: req.profileUser.avatar,
      isFollowing: req.isFollowing,
      isVisitorsProfile: req.isVisitorsProfile,
      counts: {postsCount: req.postsCount, followersCount: req.followersCount, followingCount: req.followingCount}
    })
  }catch {
    res.render("404")
  }
}