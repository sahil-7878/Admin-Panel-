const passport = require('passport');
const localStratergy = require('passport-local').Strategy;
const Admin = require('../models/Admin')
const bcrypt = require('bcrypt')

passport.use(new localStratergy(
    { usernameField: 'email' },

    async function (username, password, done) {
        try {
            let adminRecord = await Admin.findOne({ email: username })
            console.log(adminRecord)
            const isMatch = await bcrypt.compare(password, adminRecord.password)

            if (!adminRecord || !isMatch) {
                console.log("invalid username or password");
                return done(null, false);
            }
            return done(null, adminRecord);
        } catch (error) {
            console.error("error to find user details: ", error);
            return done(error);
        }
    }
))

passport.serializeUser(function (user, done) {
    done(null, user.id);
})

passport.deserializeUser(async function (id, done) {
    try {
        let user = await Admin.findById(id);
        if (!user) return done(null, false)

        return done(null, user);
    } catch (error) {
        console.log("error to find user detail");
        return done(error);
    }
})

passport.checkAuthentication = function (req, res, next) {
    if (req.isAuthenticated()) return next()

    return res.redirect('/login');
}

passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) res.locals.user = req.user;
    next();
}

module.exports = passport;