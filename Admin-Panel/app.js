const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const session = require('express-session')
const passport = require('passport')
const passportLocal = require('./config/passport-local-stratergy.js')
const flash = require('connect-flash')
const Product = require('./models/Products')

const PORT = 8001;

const app = express();
connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use(session({
    name: 'nexus_panel',
    secret: 'f0c2913abe7d25de86ad45c52a1be715',
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 100
    }
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(passport.setAuthenticatedUser)

app.use(flash());

// middleware for bin count
app.use(async function (req, res, next) {
    if (req.isAuthenticated()) {
        try {
            const trashCount = await Product.countDocuments({
                userID: req.user._id,
                isDeleted: true
            })

            res.locals.trashCount = trashCount
        } catch (err) {
            console.log("Error counting trash:", err);
            res.locals.trashCount = 0;
        }
    } else {
        res.locals.trashCount = 0
    }
    next();
})

app.use(function (req, res, next) {
    res.locals.flash = {
        'success': req.flash('success'),
        'error': req.flash('error')
    }
    next();
});

app.use('/', require('./routes/adminRoutes.js'));
app.get('/', (req, res) => {
    res.redirect('/dashboard');
})

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
        return false;
    }
    console.log(`Server is Running on port : http://localhost:${PORT}`);
})