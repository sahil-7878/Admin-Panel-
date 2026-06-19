const express = require('express')
const adminCtl = require('../controllers/adminController')
const Admin = require('../models/Admin')
const route = express.Router();
const cookieParser = require('cookie-parser')
const passport = require('passport');
const { checkRole } = require('../config/middleware')
route.use(cookieParser())

route.get('/login', adminCtl.login)
route.post('/verifyLogin', passport.authenticate('local', { failureRedirect: '/login' }), adminCtl.verifyLogin)
route.get('/signup', adminCtl.signup)
route.post('/signup', Admin.uploadAdminImage, adminCtl.registerAdmin)
route.get('/logout', adminCtl.logout)

route.get('/forgetPassword/check-email', adminCtl.checkEmail)
route.post('/forgetPassword/send-otp', adminCtl.sendOtp)
route.get('/forgetPassword/otp', adminCtl.otp)
route.post('/forgetPassword/verify-otp', adminCtl.verifyOtp)
route.get('/forgetPassword/set-password', adminCtl.setPassword)
route.post('/forgetPassword/reset-password', adminCtl.resetPassword)

route.get('/dashboard', passport.checkAuthentication, adminCtl.dashboard)
route.get('/profile', passport.checkAuthentication, adminCtl.profile)
route.post('/update-profile', passport.checkAuthentication, Admin.uploadAdminImage, adminCtl.updateProfile)

route.get('/settings', passport.checkAuthentication, Admin.uploadAdminImage, adminCtl.settings)
route.post('/change-password', passport.checkAuthentication, Admin.uploadAdminImage, adminCtl.changePassword)
route.post('/delete-my-account', passport.checkAuthentication, Admin.uploadAdminImage, adminCtl.deleteMyAccount)

route.get('/add-admin', passport.checkAuthentication, adminCtl.addAdmin)
route.get('/view-admin', passport.checkAuthentication, checkRole(['Super Admin', 'City Admin', 'Zonal Admin']), adminCtl.viewAdmin)
route.post('/insertAdminData', passport.checkAuthentication, Admin.uploadAdminImage, adminCtl.insertAdminData)

route.get('/adminDetails/:id', passport.checkAuthentication, adminCtl.adminDetails)
route.get('/delete-admin/', passport.checkAuthentication, adminCtl.deleteAdmin)
route.post('/update-admin/:id', passport.checkAuthentication, Admin.uploadAdminImage, adminCtl.updateAdmin)

// Category Routes
route.use('/category', require('./categoryRoute'))
route.use('/subcategory', require('./subCategoryRoute'))
route.use('/product', require('./productRoute'))

module.exports = route;