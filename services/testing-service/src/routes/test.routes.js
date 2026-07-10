"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var test_controller_js_1 = require("../controllers/test.controller.js");
var auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
var shared_1 = require("shared");
var router = (0, express_1.Router)();
// Unauthenticated (Public)
router.get('/public', test_controller_js_1.publicEndpoint);
// Authenticated (Any valid user)
router.get('/authenticated', auth_middleware_js_1.authenticate, test_controller_js_1.authenticatedEndpoint);
// Role-based authorization
router.get('/admin', auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)([shared_1.Role.Admin]), test_controller_js_1.adminOnlyEndpoint);
router.get('/staff-or-admin', auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)([shared_1.Role.Admin, shared_1.Role.Stuff]), test_controller_js_1.staffAndAdminEndpoint);
exports.default = router;
