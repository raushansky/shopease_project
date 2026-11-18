
const adminMiddleware = (req, res, next) => {

    // Check if user is logged in
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Please login first"
        });
    }

    // Check admin role
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin only."
        });
    }

    next();
};

module.exports = adminMiddleware;
