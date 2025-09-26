"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/analyze', (req, res) => {
    res.json({ message: 'AI analyze endpoint' });
});
router.post('/explain', (req, res) => {
    res.json({ message: 'AI explain endpoint' });
});
router.post('/auto-fix', (req, res) => {
    res.json({ message: 'AI auto-fix endpoint' });
});
exports.default = router;
//# sourceMappingURL=ai.js.map