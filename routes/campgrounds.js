const express = require('express'),
    router = express.Router(),
    capitalizeFirstLetter = require('../utils/utils'),
    Campground = require('../models/campground'),
    {
        checkCampgroundOwnership,
        isLoggedIn
    } = require('../middlewares')

// * Campground 
router.get('/', function (req, res) {
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.error('Error at home Route', err)
            req.flash('error', ' Cannot Reach Campground Page')
            res.redirect('/')
        } else {
            res.render('campground/Index', { campgrounds: campgrounds })
        }
    })
})

// * Create new campground route
router.post('/', isLoggedIn, function (req, res) {
    var newCampName = req.body.newCampName
    var newCampImage = req.body.newCampImage
    var campgroundPrice = req.body.campPrice
    var campDescription = req.body.campDescription
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {
        name: newCampName,
        image: newCampImage,
        price: campgroundPrice,
        description: campDescription,
        author: author
    }

    Campground.create(newCampground, function (err, newCampground) {
        if (err) {
            console.error('Error at Campground Create Route', err)
            req.flash('error', 'failed to post Campground')
            res.redirect('/campgrounds')

        } else {
            req.flash('success', 'Campground Created Successfully')
            res.redirect('/campgrounds')
        }
    })

})

// * New Campground
router.get('/new', isLoggedIn, function (req, res) {
    res.render('campground/new', function (err, docs) {
        if (err) {
            console.error('Error at Campground new Route', err)
            req.flash('error', 'Could not perform Operation.')
            res.redirect('/campgrounds')
        } else {
            res.send(docs)
        }
    })

})

// * campground show route
router.get('/:id', function (req, res) {
    Campground.findById(req.params.id).populate('comments').exec(function (err, aboutCamp) {
        if (err) {
            console.error('Error at Campground show Route', err)
            req.flash('error', 'Campground not found')
            res.redirect('/campgrounds')
        } else {
            res.render("campground/show", {
                campground: aboutCamp,
            })
        }
    })
})

// * Edit Campground Route
router.get('/:id/edit', checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.error('Error at Campground edit Route', err)
            req.flash('error', 'Campground not found')
            res.redirect('back')
        } else {
            res.render('campground/edit', { Campground: foundCampground })
        }
    })
})

// * Update Route
router.put('/:id', checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, UpdatedCampground) {
        if (err) {
            console.error('Error at Campground Update Route', err)
            req.flash('error', 'Could Not Update Campground Something went wrong')
            res.redirect('/campgrounds' + req.params.id)
        } else {
            req.flash('success', 'Updated ' + capitalizeFirstLetter(UpdatedCampground.name) + ' successfully')
            res.redirect('/campgrounds/' + req.params.id)
        }

    })
})

router.delete('/:id', checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndDelete(req.params.id, function (err, deletedCamp) {
        if (err) {
            console.error('Error at Campground Delete Route', err)
            req.flash('error', 'Could Not Delete Campground Something went wrong')
            res.redirect('/campgrounds')
        } else {
            req.flash('success', 'Campground deleted successfully')
            res.redirect('/campgrounds')
        }
    })

})


module.exports = router

// let flashMessagesObj = {
//     deleted: req.flash('deletedCampground'),
//     created: req.flash('createdCampground'),
//     success: req.flash('success'),
// }
// const templateObject = {
//     campgrounds: campgrounds,
//     flashMessage: Object.keys(flashMessagesObj).map(function (key) {
//         if (flashMessagesObj[key].length <= 0) return flashMessagesObj[key]
//         if (flashMessagesObj.success === flashMessagesObj[key]) return flashMessagesObj[key] + " " + req.user.username
//         return flashMessagesObj[key]
//     }).filter(flash => flash.length)
// }

// const flashMessObj = {
// deleted: req.flash('deletedCampground'),
//     created: req.flash('createdCampground'),
//         success: req.flash('success')
//             }
// const flashMessageKey = Object.keys(flashMessObj).find(key => flashMessObj[key].length)
// const templateObject = {
//     campgrounds: campgrounds,
//     flashMessage: flashMessageKey === 'success' ? [flashMessObj[flashMessageKey] + ' ' + req.user.username] : flashMessObj[flashMessageKey] || []
// }