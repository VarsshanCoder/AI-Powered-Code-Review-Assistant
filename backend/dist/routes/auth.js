"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/login', (req, res) => {
    res.json({ message: 'Login endpoint' });
});
router.post('/register', (req, res) => {
    res.json({ message: 'Register endpoint' });
});
router.post('/logout', (req, res) => {
    res.json({ message: 'Logout endpoint' });
});
exports.default = router;
//# sourceMappingURL=auth.js.map