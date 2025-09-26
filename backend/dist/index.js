"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./utils/logger");
const auth_1 = __importDefault(require("./routes/auth"));
const repository_1 = __importDefault(require("./routes/repository"));
const review_1 = __importDefault(require("./routes/review"));
const ai_1 = __importDefault(require("./routes/ai"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
exports.io = io;
const PORT = process.env.PORT || 3001;
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/repositories', repository_1.default);
app.use('/api/reviews', review_1.default);
app.use('/api/ai', ai_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Error handling
app.use(errorHandler_1.errorHandler);
// Socket.IO for real-time collaboration
io.on('connection', (socket) => {
    logger_1.logger.info(`User connected: ${socket.id}`);
    socket.on('join-review', (reviewId) => {
        socket.join(`review-${reviewId}`);
        logger_1.logger.info(`User ${socket.id} joined review ${reviewId}`);
    });
    socket.on('leave-review', (reviewId) => {
        socket.leave(`review-${reviewId}`);
    });
    socket.on('disconnect', () => {
        logger_1.logger.info(`User disconnected: ${socket.id}`);
    });
});
server.listen(PORT, () => {
    logger_1.logger.info(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map