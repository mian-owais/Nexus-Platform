"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const meetingRoutes_1 = __importDefault(require("./routes/meetingRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// CORS configuration
app.use((0, cors_1.default)({
    origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
    credentials: true,
    optionsSuccessStatus: 200,
}));
// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
});
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Nexus Backend is running',
        timestamp: new Date().toISOString(),
    });
});

// Root route - quick status
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Nexus Backend is running. See API at /api',
        api: '/api',
    });
});
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/meetings', meetingRoutes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.path} not found`,
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});
// Start server
const startServer = async () => {
    try {
        // Connect to database
        await (0, database_1.connectDB)();
        app.listen(PORT, () => {
            console.log(`✓ Server running on http://localhost:${PORT}`);
            console.log(`✓ API available at http://localhost:${PORT}/api`);
        });
    }
    catch (error) {
        console.error('✗ Failed to start server:', error.message);
        process.exit(1);
    }
};
// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n✓ Server shutting down gracefully...');
    process.exit(0);
});
process.on('SIGTERM', () => {
    console.log('\n✓ Server shutting down gracefully...');
    process.exit(0);
});
startServer();
exports.default = app;
