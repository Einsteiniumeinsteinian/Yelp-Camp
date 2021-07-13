const express             = require('express'),
    app                   = express(),
    bodyParser            = require('body-parser'),
    mongoose              = require('mongoose'),
    passport              = require('passport'),
    LocalStrategy         = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    expressSession        = require('express-session'),
    methodOverride        = require('method-override'),
    flash                 = require('connect-flash'),
    envFiles              = require('dotenv').config()

 const  User                  = require('./models/user'),
        Campground            = require('./models/campground'),
        seedDB                = require('./seed'),
        Comment               = require('./models/comments')


 const commentRoutes         = require('./routes/comments'),
       campgroundRoutes      = require('./routes/campgrounds'),
       indexRoutes           = require('./routes/index')

console.log("Data base url is",process.env.DatabaseUrl)
mongoose.connect(
    process.env.DatabaseUrl,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
    ).then(console.log('Connected to Mongo Atlas successfully'))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'))

// ? PASSPORT CONFIG
app.use(expressSession({
    secret: 'ExpressSessionSecretPassword',
    resave: false,
    saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(function (req, res, next) {
    const flashMessages = {
        success: {message: req.flash('success'), bootstrapClass: 'success'},
        error:{message: req.flash('error'), bootstrapClass: 'danger'}
    }
  let  flashMessageChecker = Object.keys(flashMessages).find(key => flashMessages[key].message.length)
  res.locals.flashNotification = flashMessages[flashMessageChecker]
    res.locals.currentUser = req.user
    next()
})

// * connect-flash

// * routes
app.use(indexRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments',commentRoutes)

// ! seed database
// seedDB()  

//* Star Route
// app.get('*', function (req, res) {
//     res.send('Page Not Found')
// })

app.listen(process.env.PORT || 4000, function () {
    console.log('Yelp Camp Running at Port 4000')
})

