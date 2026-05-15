import { logger } from "../utils/logger.js";
import { AppError } from "../utils/errors.js";
import { config } from "../config/index.js";

export const errorHandler = (err, req, res, next) => {
    // Log error
    logger.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    // Default error
    let statusCode = 500;
    let message = "Internal Server Error";

    // AppError (custom)
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Validation errors
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = err.message;
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }

    // Send response
    res.status(statusCode).json({
        success: false,
        message,
        error: config.nodeEnv === "development" ? err.message : undefined,
    });
}