const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { promisify } = require('util');

/**
 * JWT Authentication Middleware
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ') 
            ? authHeader.substring(7) 
            : null;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Verify token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        
        // Get user from database
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token is not valid - user not found.'
            });
        }

        // Check if user account is locked
        if (user.isLocked) {
            return res.status(423).json({
                success: false,
                message: 'Account is temporarily locked due to multiple failed login attempts.'
            });
        }

        // Check if user is blacklisted
        if (user.insurance.isBlacklisted) {
            return res.status(403).json({
                success: false,
                message: 'Account has been suspended.'
            });
        }

        // Update last active
        user.activity.lastActive = new Date();
        await user.save();

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired.'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Authentication error.'
        });
    }
};

/**
 * Optional Authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ') 
            ? authHeader.substring(7) 
            : null;

        if (token) {
            const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            if (user && !user.isLocked && !user.insurance.isBlacklisted) {
                req.user = user;
            }
        }
        
        next();
    } catch (error) {
        // Ignore errors for optional auth
        next();
    }
};

/**
 * Role-based Authorization Middleware
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions.'
            });
        }

        next();
    };
};

/**
 * Permission-based Authorization Middleware
 */
const requirePermission = (...permissions) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }

        const hasPermission = permissions.some(permission => 
            req.user.hasPermission(permission)
        );

        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions.'
            });
        }

        next();
    };
};

/**
 * Wallet Authentication Middleware
 */
const authenticateWallet = async (req, res, next) => {
    try {
        const { walletAddress, signature, message } = req.body;
        
        if (!walletAddress || !signature || !message) {
            return res.status(400).json({
                success: false,
                message: 'Wallet address, signature, and message are required.'
            });
        }

        // Verify signature (implement proper signature verification)
        // This is a simplified version - implement proper ECDSA verification
        const isValidSignature = await verifyWalletSignature(walletAddress, signature, message);
        
        if (!isValidSignature) {
            return res.status(401).json({
                success: false,
                message: 'Invalid wallet signature.'
            });
        }

        // Find user by wallet address
        const user = await User.findByWallet(walletAddress);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Wallet not associated with any account.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Wallet authentication error.'
        });
    }
};

/**
 * Rate Limiting Middleware
 */
const createRateLimit = (windowMs, max, message) => {
    const rateLimit = require('express-rate-limit');
    
    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            message: message || 'Too many requests, please try again later.'
        },
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req) => {
            // Use user ID if authenticated, otherwise IP
            return req.user ? req.user._id.toString() : req.ip;
        }
    });
};

/**
 * Two-Factor Authentication Middleware
 */
const require2FA = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }

        if (!req.user.security.twoFactorEnabled) {
            return next(); // 2FA not enabled, continue
        }

        const { twoFactorCode } = req.body;
        if (!twoFactorCode) {
            return res.status(400).json({
                success: false,
                message: '2FA code required.',
                requires2FA: true
            });
        }

        const speakeasy = require('speakeasy');
        const verified = speakeasy.totp.verify({
            secret: req.user.security.twoFactorSecret,
            encoding: 'base32',
            token: twoFactorCode,
            window: 2
        });

        if (!verified) {
            return res.status(401).json({
                success: false,
                message: 'Invalid 2FA code.'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '2FA verification error.'
        });
    }
};

/**
 * Verify wallet signature (placeholder - implement proper verification)
 */
const verifyWalletSignature = async (walletAddress, signature, message) => {
    // Implement proper ECDSA signature verification using ethers.js
    const { ethers } = require('ethers');
    
    try {
        const recoveredAddress = ethers.utils.verifyMessage(message, signature);
        return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
    } catch (error) {
        return false;
    }
};

/**
 * API Key Authentication (for external integrations)
 */
const authenticateApiKey = async (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'];
        
        if (!apiKey) {
            return res.status(401).json({
                success: false,
                message: 'API key required.'
            });
        }

        // In a real implementation, validate API key against database
        // For now, check against environment variable
        if (apiKey !== process.env.API_KEY) {
            return res.status(401).json({
                success: false,
                message: 'Invalid API key.'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'API key authentication error.'
        });
    }
};

module.exports = {
    authenticate,
    optionalAuth,
    authorize,
    requirePermission,
    authenticateWallet,
    createRateLimit,
    require2FA,
    authenticateApiKey
};