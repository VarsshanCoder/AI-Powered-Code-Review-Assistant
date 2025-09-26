"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logger_1 = require("../utils/logger");
function errorHandler(error, req, res, next) {
    logger_1.logger.error('Unhandled error:', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
    });
    if (res.headersSent) {
        return next(error);
    }
    const isDevelopment = process.env.NODE_ENV === 'development';
    res.status(500).json({
        error: 'Internal Server Error',
        message: isDevelopment ? error.message : 'Something went wrong',
        ...(isDevelopment && { stack: error.stack }),
    });
}
//# sourceMappingURL=errorHandler.js.map