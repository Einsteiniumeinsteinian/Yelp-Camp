const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      User = require('../models/user')
      
const capitalizeFirstLetter = require('../utils/utils')



// *  root route
router.get('/', function (req, res) {
    res.render("landing_page")
})



// * Register Route
router.get('/register', function (req, res) {
    res.render('user/register')
})

router.post('/register', function (req, res) {
    // res.send('You have reached the post route')
    const newUser = new User({ username: req.body.username })
    const password = req.body.password
    User.register(newUser, password, function (err, user) {
        if (err) {
            console.error("Error at user register", err)
            req.flash('error', err.message + ' !!!')
             res.redirect('/register')
        }
        console.log('registered')
        passport.authenticate('local')(req, res, function (err) {
            if (err){
                console.log("Error at sign up authenticate", err)
                req.flash('error', 'Something went wrong')
                res.redirect('back')
            }
            console.log('logged in')
            res.redirect('/campgrounds')
        })
    })
})

// * login Routes
router.get('/login', function (req, res) {
    res.render('user/login')
})

router.post('/login', function (req, res) {
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash:  'Invalid Username or Password!!!'
    })(req, res, function (err) {
        if (err) return console.log("Error at authenticate", err)
        req.flash('success', req.user ? 'Welcome back ' + capitalizeFirstLetter(req.user.username) : '')
        console.log('logged in')
        res.redirect('/campgrounds')
    })
})

// * Log out
router.get('/logout', function (req, res) {
    req.logout()
    req.flash('success', 'Successfully logged out')
    res.redirect('/campgrounds')
})



module.exports = router