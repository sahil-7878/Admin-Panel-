const Admin = require("../models/Admin")
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const passport = require('passport');

module.exports.signup = (req, res) => {
    try {
        if (req.isAuthenticated()) {
            return res.redirect('/dashboard');
        }
        res.render('signup')
    } catch (error) {
        console.log(error)
        return res.redirect('/signup');
    }
}

module.exports.registerAdmin = async (req, res) => {
    try {
        const { fname, lname, email, password, confirm_password, gender, desc, date } = req.body;

        if (password !== confirm_password) {
            req.flash('error', 'Passwords do not match')
            return res.redirect('/signup')
        }

        const exisitingEmail = await Admin.findOne({ email: email })
        if (exisitingEmail) {
            req.flash('error', 'Email already exists...')
            return res.redirect('/signup')
        }

        let hobbies = req.body.hobby ? req.body.hobby : []
        if (!Array.isArray(hobbies)) {
            hobbies = [hobbies]
        }

        let imagePath = '';
        if (req.file) {
            imagePath = req.file ? Admin.adPath + req.file.filename : null;
        }

        const hashPassword = await bcrypt.hash(password, 12);
        await Admin.create({
            name: fname + ' ' + lname,
            email: email,
            password: hashPassword,
            gender: gender,
            hobby: hobbies,
            desc: desc,
            avatar: imagePath,
            date: date
        })

        req.flash('success', 'Registration Successful! Please Login.');
        return res.redirect('/login');
    } catch (err) {
        console.log(err);
        req.flash('error', 'Error creating account');
        res.redirect('/signup');
    }
};

module.exports.login = (req, res) => {
    try {
        if (req.isAuthenticated()) {
            return res.redirect('/dashboard');
        }
        res.render('login', { title: 'Login' })
    } catch (error) {
        console.log(error)
        return res.redirect('/login');
    }
}

module.exports.verifyLogin = async (req, res) => {
    try {
        req.flash('success', 'Welcome back! Logged in successfully.');
        return res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
        res.redirect('/login');
    }
};

module.exports.logout = (req, res) => {
    res.clearCookie('nexus_panel');
    res.redirect('/login')
}

module.exports.dashboard = async (req, res) => {
    try {
        let admin = req.user;
        let admins = await Admin.find();

        if (admin) {
            res.render('dashboard', {
                title: 'Dashboard',
                admin,
                admins
            })
        } else {
            res.redirect('/login')
        }

    } catch (error) {
        console.log(error)
        res.redirect('/login')
    }
}

module.exports.profile = async (req, res) => {
    try {
        const admin = req.user
        res.render('profile', {
            title: 'My Profile',
            admin
        });
    } catch (error) {
        console.log(error)
        res.redirect('/login')
    }
}

module.exports.updateProfile = async (req, res) => {
    try {
        const adminId = req.user._id;
        const admin = await Admin.findById(adminId);

        if (!admin) {
            req.flash('error', 'Admin not found');
            return res.redirect('/login');
        }

        const hobbies = req.body.hobby || [];
        if (!Array.isArray(hobbies)) {
            hobbies = [hobbies]
        }

        let password = admin.password;
        if (req.body.password && req.body.password.trim() !== '') {
            password = await bcrypt.hash(req.body.password, 12);
        }

        const updateData = {
            name: req.body.fname + ' ' + req.body.lname,
            email: req.body.email,
            gender: req.body.gender,
            hobby: hobbies,
            desc: req.body.desc,
            date: req.body.date,
            password: password,
            avatar: admin.avatar
        }

        if (req.body.date && req.body.date !== '') {
            updateData.date = req.body.date;
        }

        if (req.file) {
            const newImageString = Admin.adPath + req.file.filename;

            const oldImagePath = path.join(__dirname, '..', 'uploads', 'adminImages', path.basename(admin.avatar));

            if (admin.avatar && fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
            updateData.avatar = newImageString;
        }
        await Admin.findByIdAndUpdate(adminId, updateData);

        req.flash('success', 'Profile updated successfully!');
        res.redirect('/profile');
    } catch (error) {
        console.log(error)
        res.redirect('/profile')
    }
}

module.exports.settings = async (req, res) => {
    try {
        const admin = req.user;
        res.render('settings', { title: "My Profile", admin })
    } catch (error) {

    }
}

module.exports.changePassword = async (req, res) => {
    try {
        const currentAdmin = await Admin.findById(req.user._id)

        let isMatch = await bcrypt.compare(req.body.current_password, currentAdmin.password);
        if (isMatch) {
            if (req.body.new_password === req.body.confirm_password) {
                const hashPassword = await bcrypt.hash(req.body.new_password, 12);
                await Admin.findByIdAndUpdate(req.user._id, { password: hashPassword });

                req.flash('success', 'Password changed successfully!');
                return res.redirect('/settings');
            } else {
                req.flash('error', 'New password and confirm password do not match');
                return res.redirect('/settings')
            }
        } else {
            req.flash('error', 'Current password is incorrect')
            return res.redirect('/settings')
        }
    } catch (error) {
        console.log(error);
        req.flash('error', 'Something went wrong');
        res.redirect('/login')
    }
}

module.exports.deleteMyAccount = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user._id);
        if (admin) {
            const oldImagePath = path.join(__dirname, '..', 'uploads', 'adminImages', path.basename(admin.avatar));
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
            await Admin.findByIdAndDelete(req.user._id);
            req.logout(() => {
                req.flash('success', 'Your account has been deleted.');
                res.redirect('/login')
            });
        } else {
            res.redirect('/settings');
        }
    } catch (error) {
        console.log(error);
        req.flash('error', 'Error deleting account');
        res.redirect('/settings');
    }
}

module.exports.checkEmail = async (req, res) => {
    try {
        res.render('forgetPassword/check-email');
    } catch (error) {
        console.log(error)
        res.redirect('/login')
    }
}

module.exports.sendOtp = async (req, res) => {
    try {
        const email = req.body.email;
        const admin = await Admin.findOne({ email: email })

        if (!admin) {
            console.log("Email not found");
            req.flash('error', 'Email not found')
            return res.redirect('/login');
        }

        const OTP = Math.floor(Math.random() * 999999)
        const transpoter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'shahmoksh90651@gmail.com',
                pass: 'siwsljxehjjrpfdz'
            }
        })

        const mailOptions = {
            from: 'Nexus Admin <shahmoksh90651@gmail.com>',
            to: email,
            subject: 'Password Reset OTP',
            text: '',
            html: `Your OTP for password reset is: <b> ${OTP} </b>`
        }

        transpoter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
                return res.redirect('/forgetPassword/check-email');
            } else {
                console.log('Email sent: ' + info.response)

                res.cookie('otp', OTP, { maxAge: 300000, httpOnly: true });
                res.cookie('resetEmail', email, { maxAge: 300000, httpOnly: true });

                req.flash('success', 'OTP sent to your email!');
                return res.redirect('/forgetPassword/otp');
            }
        })

    } catch (error) {
        console.log(error)
        req.flash('error', 'Error sending OTP! Try again');
        res.redirect('/forgetPassword/check-email')
    }
}

module.exports.otp = async (req, res) => {
    try {
        res.render('forgetPassword/otp');
    } catch (error) {
        console.log(error)
        res.redirect('/forgetPassword/check-email')
    }
}

module.exports.verifyOtp = async (req, res) => {
    try {
        const userOtp = req.body.otp;
        const cookieOTP = req.cookies.otp;

        if (userOtp === cookieOTP) {
            req.flash('success', 'OTP Verified! Please set a new password.');
            res.redirect('/forgetPassword/set-password');
        } else {
            req.flash('error', 'Invalid OTP. Please try again.');
            res.redirect('forgetPassword/otp');
        }
    } catch (error) {
        console.log(error)
        req.flash('error', 'Invalid OTP. Please try again.');
        res.redirect('/forgetPassword/otp')
    }
}

module.exports.setPassword = async (req, res) => {
    try {
        res.render('forgetPassword/set-password')

    } catch (error) {
        console.log(error)
        res.redirect('/forgetPassword/set-password')
    }
}

module.exports.resetPassword = async (req, res) => {
    try {
        const { new_password, confirm_password } = req.body;
        const email = req.cookies.resetEmail;

        if (!email) return res.redirect('/forgetPassword/check-email')

        if (new_password === confirm_password) {
            const hashPassword = await bcrypt.hash(new_password, 12);

            await Admin.findOneAndUpdate({ email: email }, { password: hashPassword });

            res.clearCookie('otp');
            res.clearCookie('resetEmail');

            req.flash('success', 'Password reset successfully! Please login.');
            res.redirect('/login');
        } else {
            console.log("Passwords do not match");
            res.redirect('/forgetPassword/set-password');
        }
    } catch (error) {
        req.flash('error', 'Passwords do not match');
        res.redirect('/forgetPassword/set-password');
    }
}

module.exports.addAdmin = async (req, res) => {
    try {
        res.render('add-admin', { title: 'Add-Admin', admin: req.user })
    } catch (error) {
        console.log(error)
        res.redirect('/login')
    }
}

module.exports.viewAdmin = async (req, res) => {
    try {
        let filter = {};

        if (req.user.role === 'Super Admin') {
            filter = {}
        } else if (req.user.role === 'City Admin') {
            filter = {
                city: req.user.city,
                role: { $in: ['Zonal Admin', 'Shop Admin'] }
            }
        } else if (req.user.role === 'Zonal Admin') {
            filter = {
                city: req.user.city,
                zone: req.user.zone,
                role: 'Shop Admin'
            }
        } else {
            filter = { _id: req.user._id }
        }

        const admins = await Admin.find(filter);
        res.render('view-admin', {
            title: 'View Admin',
            admins,
            admin: req.user
        });
    } catch (error) {
        console.log(error)
        res.redirect('/login')
    }
};

module.exports.insertAdminData = async (req, res) => {
    try {
        const exisitingEmail = await Admin.findOne({ email: req.body.email })

        if (exisitingEmail) {
            req.flash('error', 'Email already exists!');
            return res.redirect('/add-admin');
        }

        const { fname, lname, email, password, gender, desc, date, city, zone, role } = req.body

        let finalCity = city;
        let finalZone = zone;

        if (req.user.role === 'City Admin') {
            finalCity = req.user.city
        }

        if (req.user.zone === 'Zonal Admin') {
            finalCity = req.user.city;
            finalZone = req.user.zone;
        }

        const imagePath = req.file ? Admin.adPath + req.file.filename : null;

        const hobbies = Array.isArray(req.body.hobby) ? req.body.hobby : [req.body.hobby]

        const hashPassword = await bcrypt.hash(password, 12)

        await Admin.create({
            name: fname + ' ' + lname,
            email: email,
            password: hashPassword,
            gender: gender,
            hobby: hobbies,
            desc: desc,
            avatar: imagePath,
            role: req.body.role || 'Shop Admin',
            date: date,
            // New Fileds for role base Authentication
            role: role,
            city: finalCity,
            zone: finalZone
        });

        req.flash('success', 'New Admin Created Successfully!');
        res.redirect('/view-admin')
    }
    catch (err) {
        console.log(err);
        req.flash('error', 'Error creating admin');
        res.redirect('/add-admin');
    }
}

module.exports.adminDetails = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        res.json(admin)
    }
    catch (err) {
        console.log(err)
        res.send('Error Fetching Admin Details')
    }
};

module.exports.deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.query.deleteAdmin);

        const oldImagePath = path.join(__dirname, '..', 'uploads', 'adminImages', path.basename(admin.avatar));
        fs.unlinkSync(oldImagePath)

        await Admin.findByIdAndDelete(admin)
        req.flash('success', 'Admin deleted successfully');
        res.redirect('/view-admin')
    }
    catch (err) {
        console.log(err)
        req.flash('error', 'Error deleting admin');
        res.send('Error Fetching Admin Details')
    }
};

module.exports.updateAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.json({ success: false, message: 'Admin not found' });
        }

        const hobbies = Array.isArray(req.body.hobby) ? req.body.hobby : [req.body.hobby]

        let password = admin.password;
        if (req.body.password && req.body.password.trim() !== '') {
            password = await bcrypt.hash(req.body.password, 12);
        }

        const updateData = {
            name: req.body.fname + ' ' + req.body.lname,
            email: req.body.email,
            gender: req.body.gender,
            hobby: hobbies,
            desc: req.body.desc,
            date: req.body.date,
            password: password,
            avatar: admin.avatar
        }

        if (req.body.date && req.body.date !== '') {
            updateData.date = req.body.date;
        }

        if (req.file) {
            const newImageString = Admin.adPath + req.file.filename;

            const oldImagePath = path.join(__dirname, '..', 'uploads', 'adminImages', path.basename(admin.avatar));

            if (admin.avatar && fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
            updateData.avatar = newImageString;
        }
        await Admin.findByIdAndUpdate(req.params.id, updateData);

        res.json({ success: true, message: 'Admin updated successfully' });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Error updating admin' });
    }
};