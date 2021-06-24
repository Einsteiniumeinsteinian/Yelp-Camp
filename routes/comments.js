const express = require('express'),
    router = express.Router({ mergeParams: true }),
    Campground = require('../models/campground'),
    Comment = require('../models/comments'),
    {
        checkCommentownership,
        isLoggedIn
    } = require('../middlewares')

// * Comments new
router.get('/new', isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.error('Error at comment new Route', err)
            req.flash('error', 'Could not perform Operation')
            res.redirect('/campgrounds' + req.params.id)
        } else {
            res.render('comments/new', { campground: campground })
        }
    })
})
// * Comments create
router.post('/', isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.error('Error at Comment create Route', err)
            req.flash('error', 'Could not perform Operation. Something went wrong')
            res.redirect('/campgrounds' + req.params.id)
        } else {
            Comment.create(req.body.comment, function (err, newComment) {
                if (err) {
                    console.error('Error at Comment Create Route', err)
                    req.flash('error', 'failed to post comment')
                    res.redirect('/campgrounds' + req.params.id)
                } else {
                    newComment.author.id = req.user._id
                    newComment.author.username = req.user.username;
                    newComment.save()
                    campground.comments.push(newComment)
                    campground.save()
                    req.flash('success', 'Posted Review')
                    res.redirect('/campgrounds/' + req.params.id)
                }
            })
        }
    })
})

// * Edit Comments
router.get('/:comment_id/edit', checkCommentownership, function (req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err) {
            console.error('Error at Comment edit Route', err)
            req.flash('error', 'Comment not found')
            res.redirect('back')
        } else {
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment})
        }
    })
})

// * Update Comments
router.put('/:comment_id', checkCommentownership, function (req, res) {
    // req.comment.updateOne(req.body.comment, function(err, UpdatedComment){
    //     res.redirect('/campgrounds/' + req.params.id)
    // })
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, UpdatedComment) {
        if (err){
            console.error('Error at Comment Update Route', err)
            req.flash('error', 'Could Not Update Comment Something went wrong')
            res.redirect('back')
        }else{ 
            req.flash('success', 'Updated Comment')
           res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

router.delete('/:comment_id', checkCommentownership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err){
            console.error('Error at Comment Delete Route', err)
            req.flash('error', 'Could Not Delete Comment Something went wrong')
            res.redirect('/campgrounds' + req.params.id)
        }else{
            req.flash('success', 'Comments Deleted Successfully')
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})


module.exports = router