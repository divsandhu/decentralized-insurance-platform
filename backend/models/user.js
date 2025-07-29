const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // Authentication
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    
    // Blockchain identity
    walletAddress: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true
    },
    walletConnected: {
        type: Boolean,
        default: false
    },
    
    // Personal information
    profile: {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        dateOfBirth: Date,
        phone: {
            type: String,
            trim: true
        },
        avatar: String, // IPFS hash or URL
        
        // Address
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        },
        
        // Identity verification
        identityVerified: {
            type: Boolean,
            default: false
        },
        identityDocuments: [{
            type: String, // 'passport', 'license', 'id_card'
            hash: String, // IPFS hash
            verified: Boolean,
            verifiedDate: Date
        }],
        
        // Emergency contact
        emergencyContact: {
            name: String,
            relationship: String,
            phone: String,
            email: String
        }
    },
    
    // Account settings
    settings: {
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            sms: {
                type: Boolean,
                default: false
            },
            push: {
                type: Boolean,
                default: true
            }
        },
        privacy: {
            profileVisibility: {
                type: String,
                enum: ['public', 'private'],
                default: 'private'
            },
            dataSharing: {
                type: Boolean,
                default: false
            }
        },
        preferences: {
            language: {
                type: String,
                default: 'en'
            },
            currency: {
                type: String,
                default: 'USD'
            },
            timezone: {
                type: String,
                default: 'UTC'
            }
        }
    },
    
    // Role and permissions
    role: {
        type: String,
        enum: ['user', 'adjuster', 'admin', 'super_admin'],
        default: 'user'
    },
    permissions: [{
        type: String,
        enum: [
            'create_policy',
            'file_claim',
            'process_claim',
            'approve_claim',
            'manage_users',
            'view_analytics',
            'system_admin'
        ]
    }],
    
    // Insurance-specific data
    insurance: {
        // Risk profile
        riskScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 50
        },
        riskFactors: [String],
        
        // Policy history
        totalPolicies: {
            type: Number,
            default: 0
        },
        activePolicies: {
            type: Number,
            default: 0
        },
        totalPremiumsPaid: {
            type: String,
            default: '0'
        },
        
        // Claims history
        totalClaims: {
            type: Number,
            default: 0
        },
        approvedClaims: {
            type: Number,
            default: 0
        },
        totalPayoutsReceived: {
            type: String,
            default: '0'
        },
        
        // Reputation
        reputationScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 100
        },
        
        // Blacklist status
        isBlacklisted: {
            type: Boolean,
            default: false
        },
        blacklistReason: String,
        blacklistDate: Date,
        
        // Preferred policy types
        preferredPolicyTypes: [{
            type: String,
            enum: ['Life', 'Health', 'Auto', 'Property', 'Travel']
        }]
    },
    
    // Security
    security: {
        twoFactorEnabled: {
            type: Boolean,
            default: false
        },
        twoFactorSecret: String,
        backupCodes: [String],
        
        // Login tracking
        lastLogin: Date,
        lastLoginIP: String,
        loginAttempts: {
            type: Number,
            default: 0
        },
        lockedUntil: Date,
        
        // Password reset
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        
        // Email verification
        emailVerified: {
            type: Boolean,
            default: false
        },
        emailVerificationToken: String,
        emailVerificationExpires: Date
    },
    
    // Activity tracking
    activity: {
        lastActive: Date,
        totalSessions: {
            type: Number,
            default: 0
        },
        averageSessionDuration: Number, // in minutes
        
        // Feature usage
        featuresUsed: [{
            feature: String,
            count: Number,
            lastUsed: Date
        }]
    },
    
    // Communication preferences
    communications: {
        marketingEmails: {
            type: Boolean,
            default: false
        },
        policyReminders: {
            type: Boolean,
            default: true
        },
        claimUpdates: {
            type: Boolean,
            default: true
        },
        securityAlerts: {
            type: Boolean,
            default: true
        }
    },
    
    // Compliance and legal
    compliance: {
        termsAccepted: {
            type: Boolean,
            default: false
        },
        termsAcceptedDate: Date,
        privacyPolicyAccepted: {
            type: Boolean,
            default: false
        },
        privacyPolicyAcceptedDate: Date,
        
        // KYC (Know Your Customer)
        kycStatus: {
            type: String,
            enum: ['pending', 'verified', 'rejected', 'expired'],
            default: 'pending'
        },
        kycVerifiedDate: Date,
        kycDocuments: [{
            type: String,
            hash: String,
            status: String
        }]
    }
}, {
    timestamps: true,
    toJSON: { 
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.password;
            delete ret.security.twoFactorSecret;
            delete ret.security.backupCodes;
            delete ret.security.resetPasswordToken;
            delete ret.security.emailVerificationToken;
            return ret;
        }
    },
    toObject: { virtuals: true }
});

// Indexes for efficient queries
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ walletAddress: 1 }, { unique: true, sparse: true });
userSchema.index({ 'profile.firstName': 1, 'profile.lastName': 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'insurance.isBlacklisted': 1 });
userSchema.index({ 'security.lastLogin': -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
    return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
    return !!(this.security.lockedUntil && this.security.lockedUntil > Date.now());
});

// Pre-save middleware
userSchema.pre('save', async function(next) {
    // Hash password if modified
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    }
    
    // Update last active
    if (this.isModified() && !this.isNew) {
        this.activity.lastActive = new Date();
    }
    
    // Set default permissions based on role
    if (this.isModified('role')) {
        switch (this.role) {
            case 'user':
                this.permissions = ['create_policy', 'file_claim'];
                break;
            case 'adjuster':
                this.permissions = ['create_policy', 'file_claim', 'process_claim'];
                break;
            case 'admin':
                this.permissions = ['create_policy', 'file_claim', 'process_claim', 'approve_claim', 'view_analytics'];
                break;
            case 'super_admin':
                this.permissions = ['create_policy', 'file_claim', 'process_claim', 'approve_claim', 'manage_users', 'view_analytics', 'system_admin'];
                break;
        }
    }
    
    next();
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.incrementLoginAttempts = function() {
    // If we have a previous lock that has expired, restart at 1
    if (this.security.lockedUntil && this.security.lockedUntil < Date.now()) {
        return this.updateOne({
            $unset: { 'security.lockedUntil': 1 },
            $set: { 'security.loginAttempts': 1 }
        });
    }
    
    const updates = { $inc: { 'security.loginAttempts': 1 } };
    
    // If we have max attempts and we're not locked, lock the account
    if (this.security.loginAttempts + 1 >= 5 && !this.isLocked) {
        updates.$set = { 'security.lockedUntil': Date.now() + 2 * 60 * 60 * 1000 }; // Lock for 2 hours
    }
    
    return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $unset: { 'security.loginAttempts': 1, 'security.lockedUntil': 1 }
    });
};

userSchema.methods.updateRiskProfile = function() {
    // Calculate risk score based on various factors
    let riskScore = 50; // Base score
    
    // Adjust based on claim history
    if (this.insurance.totalClaims > 0) {
        const claimRatio = this.insurance.approvedClaims / this.insurance.totalClaims;
        if (claimRatio > 0.8) riskScore += 20;
        else if (claimRatio < 0.3) riskScore -= 10;
    }
    
    // Adjust based on age (if available)
    if (this.profile.dateOfBirth) {
        const age = (Date.now() - this.profile.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
        if (age < 25 || age > 65) riskScore += 10;
        else if (age >= 30 && age <= 50) riskScore -= 5;
    }
    
    // Adjust based on verification status
    if (this.profile.identityVerified) riskScore -= 5;
    if (this.compliance.kycStatus === 'verified') riskScore -= 5;
    
    this.insurance.riskScore = Math.max(0, Math.min(100, riskScore));
    return this.save();
};

userSchema.methods.hasPermission = function(permission) {
    return this.permissions.includes(permission);
};

userSchema.methods.connectWallet = function(walletAddress) {
    this.walletAddress = walletAddress.toLowerCase();
    this.walletConnected = true;
    return this.save();
};

userSchema.methods.disconnectWallet = function() {
    this.walletAddress = undefined;
    this.walletConnected = false;
    return this.save();
};

// Static methods
userSchema.statics.findByWallet = function(walletAddress) {
    return this.findOne({ walletAddress: walletAddress.toLowerCase() });
};

userSchema.statics.findByRole = function(role) {
    return this.find({ role });
};

userSchema.statics.getActiveUsers = function(days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return this.find({
        'activity.lastActive': { $gte: cutoffDate }
    });
};

userSchema.statics.getUserStatistics = function() {
    return this.aggregate([
        {
            $group: {
                _id: '$role',
                count: { $sum: 1 },
                verified: { $sum: { $cond: ['$profile.identityVerified', 1, 0] } },
                walletConnected: { $sum: { $cond: ['$walletConnected', 1, 0] } }
            }
        }
    ]);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
