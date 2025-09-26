"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.json({ message: 'Get repositories' });
});
router.post('/', (req, res) => {
    res.json({ message: 'Add repository' });
});
router.get('/:id', (req, res) => {
    res.json({ message: 'Get repository' });
});
exports.default = router;
//# sourceMappingURL=repository.js.map