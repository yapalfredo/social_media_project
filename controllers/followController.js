const Follow = require('../models/Follow')

exports.addFollow = function(req, res){
    let follow = new Follow(req.params.username, req.visitorId)
    follow.create().then(() => {
        req.flash("success", `Successfully followed ${req.params.username}!`)
        req.session.save(() => res.redirect(`/profile/${req.params.username}`))
    }).catch((errors) => {
        errors.forEach(e => {
            req.flash("errors", e)
        })
        req.session.save(() => res.redirect('/'))
    })

}