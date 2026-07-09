"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mongoose_1 = require("mongoose");
var test_routes_js_1 = require("./routes/test.routes.js");
var shared_1 = require("shared");
var app = (0, express_1.default)();
app.use(express_1.default.json());
var PORT = process.env.PORT || 3002;
var MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/GlobalBackend_test';
app.use('/', test_routes_js_1.default);
mongoose_1.default.connect(MONGO_URI)
    .then(function () {
    shared_1.logger.info('Connected to MongoDB: GlobalBackend_test');
    app.listen(PORT, function () {
        shared_1.logger.info("Testing service is running on port ".concat(PORT));
    });
})
    .catch(function (err) {
    shared_1.logger.error('MongoDB connection error', err);
});
