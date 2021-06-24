const Campground = require('../models/campground'),
    Comment = require('../models/comments')

module.exports = {
    checkCampgroundOwnership: function (req, res, next) {
        if (req.isAuthenticated()) {
            Campground.findById(req.params.id, function (err, foundCampground) {
                if (err) {
                    console.error('Error at checkCampgroundOwnership middleware', err)
                    req.flash('error', 'Campground not found')
                    res.redirect('back')
                } else {
                    if (foundCampground.author.id.toString() !== req.user._id.toString()) {
                        req.flash('error', 'You are not authorized to do that edit Campground')
                        return res.redirect('back')
                    } else {
                        return next()
                    }
                }
            })
        } else {
            req.flash('error', 'You are not authorized to edit Campground')
            res.redirect('/login')
        }


    },
    checkCommentownership: function (req, res, next) {
        if (req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, function (err, foundComment) {
                if (err) {
                    console.error('Error at checkCommentOwnership middleware', err)
                    req.flash('error', 'Comment not found')
                    return res.redirect('back')
                } else {
                    if (foundComment.author.id.toString() !== req.user._id.toString()) {
                        req.flash('error', 'You are not authorized to edit Comment')
                        res.redirect('back')
                    } else {
                        next()
                    }
                }
            })
         
        } else{
            req.flash('error', 'You are not authorized to edit Comment')
            res.redirect('/login')
        }
       
    },
    isLoggedIn: function (req, res, next) {
        if (req.isAuthenticated()) return next()
        req.flash('error', 'Please Login!!!')
        res.redirect('/login')
    }
}