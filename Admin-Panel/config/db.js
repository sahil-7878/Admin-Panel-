const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/Admin-Pannel')
        console.log('Connected to DB')
    } catch (error) {
        console.log("DB Error : ", err);
    }
}

module.exports = connectDB;