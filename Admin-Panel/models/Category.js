const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    cat_name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Active'
    },
}, {
    timestamps: true
})

const Category = mongoose.model("Categories", categorySchema)

module.exports = Category
