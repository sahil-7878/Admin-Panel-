module.exports.checkRole = (roles) => {
    return (req, res, next) => {
        if (req.isAuthenticated() && roles.includes(req.user.role)) {
            return next();
        }
        req.flash('error', "Access Denied")
        return res.redirect('/dashboard');
    }
}

const roleHierarchy = {
    'Super Admin': 0,
    'City Admin': 1,
    'Zonal Admin': 2,
    'Shop Admin': 3,
}

module.exports.isHigherOrEqual = (userRole, requiredRole) => {
    return roleHierarchy[userRole] = roleHierarchy(requiredRole)
}