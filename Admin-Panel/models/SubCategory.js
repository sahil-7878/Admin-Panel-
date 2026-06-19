const mongoose = require('mongoose')

const subcategorySchema = new mongoose.Schema({
    sname: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Active',
    },
    categoryID: {
        type: mongoose.Schema.ObjectId,
        ref: 'Categories'
    }
}, {
    timestamps: true
})

const SubCategory = mongoose.model("SubCategories", subcategorySchema)

module.exports = SubCategory
