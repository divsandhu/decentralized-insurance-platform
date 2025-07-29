const winston = require('winston');
const path = require('path');

// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
};

// Define colors for each level
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    verbose: 'grey',
    debug: 'white',
    silly: 'cyan'
};

winston.addColors(colors);

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.prettyPrint()
);

// Define console format for development
const consoleFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let msg = `${timestamp} [${level}]: ${message}`;
        
        // Add metadata if present
        if (Object.keys(meta).length > 0) {
            msg += ` ${JSON.stringify(meta, null, 2)}`;
        }
        
        return msg;
    })
);

// Create transports array
const transports = [];

// Console transport for development
if (process.env.NODE_ENV !== 'production') {
    transports.push(
        new winston.transports.Console({
            level: 'debug',
            format: consoleFormat
        })
    );
}

// File transports for all environments
transports.push(
    // Error log file
    new winston.transports.File({
        filename: path.join(__dirname, '../logs/error.log'),
        level: 'error',
        format: logFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5
    }),
    
    // Combined log file
    new winston.transports.File({
        filename: path.join(__dirname, '../logs/combined.log'),
        format: logFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5
    })
);

// Production-specific transports
if (process.env.NODE_ENV === 'production') {
    // Add console transport for production with limited output
    transports.push(
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.simple()
            )
        })
    );
    
    // Add HTTP transport for external logging service (e.g., Loggly, Papertrail)
    if (process.env.LOG_HTTP_URL) {
        transports.push(
            new winston.transports.Http({
                host: process.env.LOG_HTTP_HOST,
                port: process.env.LOG_HTTP_PORT,
                path: process.env.LOG_HTTP_PATH,
                level: 'error'
            })
        );
    }
}

// Create logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    levels,
    format: logFormat,
    defaultMeta: {
        service: 'decentralized-insurance-api',
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    },
    transports,
    exitOnError: false
});

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Stream for Morgan HTTP logging
logger.stream = {
    write: (message) => {
        logger.http(message.trim());
    }
};

// Helper methods for structured logging
logger.logRequest = (req, res, responseTime) => {
    const logData = {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
        userId: req.user ? req.user._id : null,
        requestId: req.id
    };
    
    if (res.statusCode >= 400) {
        logger.warn('HTTP Request Error', logData);
    } else {
        logger.http('HTTP Request', logData);
    }
};

logger.logError = (error, req = null, additionalData = {}) => {
    const errorData = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        statusCode: error.statusCode,
        isOperational: error.isOperational,
        ...additionalData
    };
    
    if (req) {
        errorData.request = {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            userId: req.user ? req.user._id : null,
            body: req.method !== 'GET' ? req.body : undefined
        };
    }
    
    logger.error('Application Error', errorData);
};

logger.logTransaction = (type, data, success = true) => {
    const logData = {
        transactionType: type,
        success,
        timestamp: new Date().toISOString(),
        ...data
    };
    
    if (success) {
        logger.info('Transaction Success', logData);
    } else {
        logger.error('Transaction Failed', logData);
    }
};

logger.logBlockchain = (action, data) => {
    logger.info('Blockchain Action', {
        action,
        timestamp: new Date().toISOString(),
        ...data
    });
};

logger.logSecurity = (event, data, level = 'warn') => {
    logger[level]('Security Event', {
        event,
        timestamp: new Date().toISOString(),
        ...data
    });
};

logger.logPerformance = (operation, duration, additionalData = {}) => {
    logger.info('Performance Metric', {
        operation,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
        ...additionalData
    });
};

// Handle uncaught exceptions and unhandled rejections
logger.exceptions.handle(
    new winston.transports.File({
        filename: path.join(__dirname, '../logs/exceptions.log'),
        format: logFormat
    })
);

logger.rejections.handle(
    new winston.transports.File({
        filename: path.join(__dirname, '../logs/rejections.log'),
        format: logFormat
    })
);

module.exports = logger;