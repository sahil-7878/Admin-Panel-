const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");

module.exports.addSubCategory = async (req, res) => {
    try {
        let categories = await Category.find()
        res.render('category/subCategory/Sub_add_category', { title: 'Add Sub Category', admin: req.user, categories })
    } catch (error) {
        console.log(error)
        return res.redirect('/category/add-category');
    }
}

module.exports.insertSubCategory = async (req, res) => {
    try {
        let subcategoryData = await SubCategory.create(req.body)
        if (subcategoryData) {
            req.flash('success', 'Sub Category added successfully!')
            res.redirect('/subCategory/viewSubCategory')
        }
    } catch (error) {
        console.log(error)
        req.flash('error', 'Error adding Sub Category!')
        res.redirect('/subCategory/addSubCategory')
    }
}

module.exports.viewSubCategory = async (req, res) => {
    try {
        let subCategories = await SubCategory.find().populate('categoryID')
        res.render('category/subCategory/sub_view_category', { title: 'View Sub Category', admin: req.user, subCategories })
    } catch (error) {
        console.log(error)
        res.render('/subCategory/viewSubCategory', { admin: [] });
    }
}

module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.query.id;
        const status = req.query.status;

        await SubCategory.findByIdAndUpdate(id, { status: status })
        req.flash('success', 'Status changed successfully!')
        res.redirect('/subCategory/viewSubCategory')
    } catch (error) {
        req.flash('error', 'Error updating status!')
        res.redirect('/subCategory/viewSubCategory')
    }
}

module.exports.updateSubCategory = async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id)
        const categories = await Category.find()
        res.render('category/subCategory/sub_edit_Category', { title: 'Edit Sub Category', admin: req.user, subCategory, categories })
    } catch (error) {
        req.flash('error', 'Error updating status!')
        res.redirect('/subCategory/viewSubCategory')
    }
}

module.exports.editSubCategory = async (req, res) => {
    try {
        await SubCategory.findByIdAndUpdate(req.params.id, req.body)
        res.redirect('/subCategory/viewSubCategory')
    } catch (error) {
        req.flash('error', 'Error updating status!')
        res.redirect('/subCategory/viewSubCategory')
    }
}

module.exports.deleteSubCategory = async (req, res) => {
    try {
        await SubCategory.findByIdAndDelete(req.params.id)
        res.redirect('/subCategory/viewSubCategory')
    } catch (error) {
        req.flash('error', 'Error updating status!')
        res.redirect('/subCategory/viewSubCategory')
    }
}
