const mongoose = require('mongoose')
const path = require('path')
const multer = require('multer')

const imagePath = '/uploads/productsImages/';

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    subcategoryID: {
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategories'
    },
    product_image: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    userID: {
        type: mongoose.Schema.ObjectId,
        ref: 'Admin'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", imagePath))
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

productSchema.statics.uploadProductImage = multer({
    storage: productStorage
}).single('product_image')

productSchema.statics.productPath = imagePath;

const Product = mongoose.model("Product", productSchema)

module.exports = Product
