const mongoose = require('mongoose')
const path = require('path')
const multer = require('multer')

const imagePath = '/uploads/adminImages/';

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    hobby: {
        type: Array,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        retuired: true
    },
    role: {
        type: String,
        enum: ['Super Admin', 'City Admin', 'Zonal Admin', 'Shop Admin'],
        default: 'Shop Admin'
    },
    city: {
        type: String
    },
    zone: {
        type: String
    }
})

const adminStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", imagePath))
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

adminSchema.statics.uploadAdminImage = multer({
    storage: adminStorage
}).single('avatar')

adminSchema.statics.adPath = imagePath;

const Admin = mongoose.model("Admin", adminSchema)

module.exports = Admin
