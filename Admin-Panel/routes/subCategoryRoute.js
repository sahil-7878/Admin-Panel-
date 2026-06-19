const express = require('express')
const subCategoryCtl = require('../controllers/subCategoryController')
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const passport = require('passport');

const route = express.Router();

route.get('/addSubCategory', passport.checkAuthentication, subCategoryCtl.addSubCategory)
route.post('/addSubCategory', passport.checkAuthentication, subCategoryCtl.insertSubCategory)
route.get('/viewSubCategory', passport.checkAuthentication, subCategoryCtl.viewSubCategory)
route.get('/changeStatus', passport.checkAuthentication, subCategoryCtl.changeStatus)
route.get('/updateSubCategory/:id', passport.checkAuthentication, subCategoryCtl.updateSubCategory)
route.post('/editSubCategory/:id', passport.checkAuthentication, subCategoryCtl.editSubCategory)
route.get('/deleteSubCategory/:id', passport.checkAuthentication, subCategoryCtl.deleteSubCategory)

module.exports = route;