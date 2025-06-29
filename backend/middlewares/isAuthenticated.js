const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access", success: false });
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "Server configuration error", success: false });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized access", success: false });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized access", success: false });
    }
};

module.exports = isAuthenticated;
