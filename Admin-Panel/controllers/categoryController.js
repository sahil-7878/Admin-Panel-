const Category = require("../models/Category");

module.exports.addCategory = (req, res) => {
    try {
        res.render('category/add_category', { title: 'Add Category', admin: req.user })
    } catch (error) {
        console.log(error)
        return res.redirect('/category/add-category');
    }
}

module.exports.insertCategory = async (req, res) => {
    try {
        let categoryData = await Category.create(req.body)
        if (categoryData) {
            req.flash('success', 'Category added successfully!')
            res.redirect('/category/viewCategory')
        }
    } catch (error) {
        req.flash('error', 'Error adding Category!')
        res.redirect('/category/addCategory')
    }
}

module.exports.viewCategory = async (req, res) => {
    try {
        let categories = await Category.find()
        res.render('category/view_category', { title: 'View Category', admin: req.user, categories })
    } catch (error) {
        console.log(error)
        res.render('/categoryviewCategory', { admin: [] });
    }
}

module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.query.id;
        const status = req.query.status;

        await Category.findByIdAndUpdate(id, { status: status })
        req.flash('success', 'Status changed successfully!')
        res.redirect('/category/viewCategory')
    } catch (error) {
        req.flash('error', 'Error updating status!')
        res.redirect('/category/viewCategory')
    }
}

module.exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
        res.render('category/edit_category', { title: 'Edit Category', admin: req.user, category: category })
    } catch (error) {
        req.flash('error', 'Error updating status!')
        res.redirect('/category/viewCategory')
    }
}

module.exports.editCategory = async (req, res) => {
    try {
        await Category.findByIdAndUpdate(req.params.id, req.body)
        res.redirect('/category/viewCategory')
    } catch (error) {
        req.flash('error', 'Error updating status!')
        res.redirect('/category/viewCategory')
    }
}

module.exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id)
        res.redirect('/category/viewCategory')
    } catch (error) {
        req.flash('error', 'Error updating status!')
        res.redirect('/category/viewCategory')
    }
}
