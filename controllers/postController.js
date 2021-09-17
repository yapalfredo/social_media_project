const Post = require('../models/Post')
const User = require('../models/User')


exports.viewCreateScreen = function(req, res) {
    //No need of 2nd argument, since app res.locals is already implemented in app.js
    //res.render('create-post', {username: req.session.user.username, avatar: req.session.user.avatar})

    res.render('create-post')
}

exports.createPost = function(req, res){
    let post = new Post(req.body, req.session.user._id);
    console.log(post)
    post.createPost().then(function(){
        res.send("Clicked create button")
    }).catch(function(err){
        res.send(err)
    })
}

exports.viewSingle = async function(req, res){
    try {
        let post = await Post.findSingleById(req.params.id, req.visitorId)
        res.render('single-post-screen', {post: post})
    } catch (err) {
        res.render('404')
    }
}

exports.viewEditScreen = async function(req, res){
    try{
        let post = await Post.findSingleById(req.params.id)
        res.render("edit-post", {post: post})
    }catch {
        res.render("404")
    }
}

exports.edit = function(req, res){
    let post = new Post(req.body, req.visitorId, req.params.id)
    post.update().then((status)=>{
        // the post was successfully updated in the database
        // or user did have permission, but there were validation errors
        if (status == "success") {
            //post was updated in MongoDB
            req.flash("success", "post successfully updated!")
            req.session.save(function(){
                res.redirect(`/post/${req.params.id}/edit`)
            })
        } else {
            post.errors.forEach(function(err){
                req.flash("errors", err)
            })
            req.session.save(function(){
                res.redirect(`/post/${req.params.id}/edit`)
            })
        }
    }).catch(()=>{
        // if the post with the requested id doesn't exist
        // or if the current visitor is not the owner of the requested post
        req.flash("errors", "You do not have permission to perform that action.")
        req.session.save(function(){
            res.redirect("/")
        })
    })
}