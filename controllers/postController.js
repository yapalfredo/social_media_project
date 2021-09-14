

exports.viewCreateScreen = function(req, res) {
    //No need of 2nd argument, since app res.locals is already implemented in app.js
    //res.render('create-post', {username: req.session.user.username, avatar: req.session.user.avatar})

    res.render('create-post')
}