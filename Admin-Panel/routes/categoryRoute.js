const express = require('express')
const categoryCtl = require('../controllers/categoryController')
const Category = require('../models/Category');
const passport = require('passport');

const route = express.Router();

route.get('/addCategory', passport.checkAuthentication, categoryCtl.addCategory)
route.post('/addCategory', passport.checkAuthentication, categoryCtl.insertCategory)
route.get('/viewCategory', passport.checkAuthentication, categoryCtl.viewCategory)
route.get('/changeStatus', passport.checkAuthentication, categoryCtl.changeStatus)
route.get('/updateCategory/:id', passport.checkAuthentication, categoryCtl.updateCategory)
route.post('/editCategory/:id', passport.checkAuthentication, categoryCtl.editCategory)
route.get('/deleteCategory/:id', passport.checkAuthentication, categoryCtl.deleteCategory)

module.exports = route;