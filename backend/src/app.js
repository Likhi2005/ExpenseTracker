import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './modules/index.js';

const app = express();

// ===== LOGGING =====
app.use(morgan('dev'));

// ===== SECURITY MIDDLEWARE =====
app.use(helmet());

// ===== RATE LIMITING =====
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: "Too many requests, please try again later."
    }
});
app.use(limiter);

// ===== CORS =====
app.use(
    cors({
        origin:
            config.nodeEnv === "production"
                ? config.frontend.url
                : ['http://localhost:5173'],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// ===== BODY PARSER =====
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== HEALTH CHECK =====
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: " API is healthy and running",
        version: '1.0.0',
        Timestamp: new Date().toISOString(),
    });
});


// ===== ROUTES =====
app.use('/api-v1', routes);

// ===== 404 HANDLER =====
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
        method: req.method,
    });
});


app.use(errorHandler);

export default app;