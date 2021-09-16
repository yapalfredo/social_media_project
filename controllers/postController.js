const Post = require('../models/Post')

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
        let post = await Post.findSingleById(req.params.id)
        res.render('single-post-screen', {post: post})
    } catch (err) {
        res.render('404')
    }
}

