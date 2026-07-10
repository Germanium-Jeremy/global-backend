"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
var authenticate = function (req, res, next) {
    var authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    var token = authHeader.split(' ')[1];
    try {
        var decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
exports.authenticate = authenticate;
var authorize = function (roles) {
    return function (req, res, next) {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: insufficient privileges' });
        }
        next();
    };
};
exports.authorize = authorize;
