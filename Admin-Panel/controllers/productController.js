const SubCategory = require("../models/SubCategory");
const Product = require("../models/Products");

module.exports.addProduct = async (req, res) => {
    try {
        let subCategories = await SubCategory.find({ status: 1 });
        res.render('product/addProduct', { title: 'Add Product', admin: req.user, subCategories })
    } catch (error) {
        console.log(error)
        return res.redirect('/product/addProduct');
    }
}

module.exports.insertProduct = async (req, res) => {
    try {
        let imagePath = '';
        if (req.file) {
            imagePath = Product.productPath + '' + req.file.filename;
        }

        await Product.create({ ...req.body, product_image: imagePath, userID: req.user._id });

        req.flash('success', 'Product added successfully!')
        res.redirect('/product/viewProduct')
    } catch (error) {
        console.log(error)
        req.flash('error', 'Error adding Product!')
        res.redirect('/product/addProduct')
    }
}

module.exports.viewProduct = async (req, res) => {
    try {
        let products = await Product.find({ userID: req.user._id, isDeleted: false }).populate({
            path: 'subcategoryID',
            select: 'sname categoryID',
            populate: {
                path: 'categoryID',
                select: 'cat_name',
            }
        })
        // res.json(products)
        res.render('product/viewProduct', { title: 'View Products', admin: req.user, products })
    } catch (error) {
        console.log(error)
        res.render('/product/viewProduct', { admin: [] });
    }
}

module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.query.id;
        const status = req.query.status;

        await Product.findByIdAndUpdate(id, { status: status })
        req.flash('success', 'Status changed successfully!')
        res.redirect('/product/viewProduct')
    } catch (error) {
        req.flash('error', 'Error updating status!')
        res.redirect('/product/viewProduct')
    }
}

module.exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        product.isDeleted = true
        await product.save();
        req.flash('success', 'Product Deleted Successfully!')
        res.redirect('/product/viewProduct')
    } catch (error) {
        console.log(error)
        req.flash('error', 'Error Deleting Product!')
        res.redirect('/product/viewProduct')
    }
}

module.exports.trashView = async (req, res) => {
    try {
        let products = await Product.find({ userID: req.user._id, isDeleted: true }).populate({
            path: 'subcategoryID',
            select: 'sname categoryID',
            populate: {
                path: 'categoryID',
                select: 'cat_name',
            }
        })
        res.render('product/trashView', { title: 'View Deleted Products', admin: req.user, products })
    } catch (error) {
        console.log(error)
        res.render('/product/trashView', { admin: [] });
    }
}

module.exports.restoreProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        product.isDeleted = false
        await product.save();
        req.flash('success', 'Product Restored Successfully!')
        res.redirect('/product/trashView')
    } catch (error) {
        console.log(error)
        req.flash('error', 'Error Restoring Product!')
        res.redirect('/product/trashView')
    }
}