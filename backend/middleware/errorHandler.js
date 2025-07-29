const logger = require('../utils/logger');

/**
 * Custom Error Classes
 */
class AppError extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message, errors = []) {
        super(message, 400);
        this.errors = errors;
    }
}

class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401);
    }
}

class AuthorizationError extends AppError {
    constructor(message = 'Access denied') {
        super(message, 403);
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

class ConflictError extends AppError {
    constructor(message = 'Resource conflict') {
        super(message, 409);
    }
}

class RateLimitError extends AppError {
    constructor(message = 'Rate limit exceeded') {
        super(message, 429);
    }
}

class BlockchainError extends AppError {
    constructor(message = 'Blockchain operation failed', statusCode = 500) {
        super(message, statusCode);
    }
}

/**
 * Error handling for different error types
 */
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new ValidationError(message);
};

const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new ConflictError(message);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => ({
        field: el.path,
        message: el.message,
        value: el.value
    }));
    
    const message = 'Invalid input data';
    return new ValidationError(message, errors);
};

const handleJWTError = () => new AuthenticationError('Invalid token. Please log in again!');

const handleJWTExpiredError = () => new AuthenticationError('Your token has expired! Please log in again.');

const handleMulterError = (err) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return new ValidationError('File too large. Maximum size is 5MB.');
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
        return new ValidationError('Too many files. Maximum is 10 files.');
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return new ValidationError('Unexpected file field.');
    }
    return new ValidationError('File upload error.');
};

/**
 * Send error response in development
 */
const sendErrorDev = (err, req, res) => {
    // Log error details
    logger.error('Error Details:', {
        error: err,
        request: {
            method: req.method,
            url: req.originalUrl,
            headers: req.headers,
            body: req.method !== 'GET' ? req.body : undefined,
            user: req.user ? req.user._id : 'Anonymous'
        },
        stack: err.stack
    });

    // API Error
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
            status: err.status,
            stack: err.stack,
            ...(err.errors && { errors: err.errors })
        });
    }

    // Rendered website error
    res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
    });
};

/**
 * Send error response in production
 */
const sendErrorProd = (err, req, res) => {
    // Log error for monitoring
    logger.error('Production Error:', {
        message: err.message,
        statusCode: err.statusCode,
        isOperational: err.isOperational,
        request: {
            method: req.method,
            url: req.originalUrl,
            userAgent: req.get('User-Agent'),
            ip: req.ip,
            user: req.user ? req.user._id : 'Anonymous'
        }
    });

    // API Error
    if (req.originalUrl.startsWith('/api')) {
        // Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                success: false,
                message: err.message,
                ...(err.errors && { errors: err.errors }),
                ...(err.statusCode === 429 && { retryAfter: err.retryAfter })
            });
        }

        // Programming or other unknown error: don't leak error details
        logger.error('UNKNOWN ERROR:', err);
        
        return res.status(500).json({
            success: false,
            message: 'Something went wrong on our end. Please try again later.'
        });
    }

    // Rendered website error
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        });
    }

    // Programming or other unknown error
    res.status(500).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later.'
    });
};

/**
 * Global error handling middleware
 */
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else {
        let error = { ...err };
        error.message = err.message;

        // Handle specific error types
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
        if (error.name === 'MulterError') error = handleMulterError(error);

        sendErrorProd(error, req, res);
    }
};

/**
 * Async error wrapper
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

/**
 * 404 handler for undefined routes
 */
const notFound = (req, res, next) => {
    const err = new NotFoundError(`Can't find ${req.originalUrl} on this server!`);
    next(err);
};

module.exports = {
    AppError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ConflictError,
    RateLimitError,
    BlockchainError,
    globalErrorHandler,
    catchAsync,
    notFound
};