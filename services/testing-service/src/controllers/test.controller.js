"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffAndAdminEndpoint = exports.adminOnlyEndpoint = exports.authenticatedEndpoint = exports.publicEndpoint = void 0;
var publicEndpoint = function (req, res) {
    res.json({ message: 'This is a public endpoint accessible by anyone.' });
};
exports.publicEndpoint = publicEndpoint;
var authenticatedEndpoint = function (req, res) {
    res.json({
        message: 'This is an authenticated endpoint.',
        user: req.user
    });
};
exports.authenticatedEndpoint = authenticatedEndpoint;
var adminOnlyEndpoint = function (req, res) {
    res.json({
        message: 'This endpoint is restricted to admins only.',
        user: req.user
    });
};
exports.adminOnlyEndpoint = adminOnlyEndpoint;
var staffAndAdminEndpoint = function (req, res) {
    res.json({
        message: 'This endpoint is accessible by admins and staff.',
        user: req.user
    });
};
exports.staffAndAdminEndpoint = staffAndAdminEndpoint;
