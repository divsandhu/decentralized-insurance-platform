const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    // Blockchain data
    blockchainId: {
        type: Number,
        required: true,
        unique: true
    },
    transactionHash: {
        type: String,
        required: true
    },
    blockNumber: {
        type: Number,
        required: true
    },
    
    // Policy details
    holder: {
        type: String, // Ethereum address
        required: true,
        lowercase: true
    },
    policyType: {
        type: String,
        enum: ['Life', 'Health', 'Auto', 'Property', 'Travel'],
        required: true
    },
    premium: {
        type: String, // Store as string to handle big numbers
        required: true
    },
    coverage: {
        type: String, // Store as string to handle big numbers
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Expired', 'Cancelled', 'Suspended'],
        default: 'Active'
    },
    
    // Metadata
    metadataHash: {
        type: String, // IPFS hash
        default: ''
    },
    metadata: {
        description: String,
        terms: String,
        conditions: [String],
        documents: [{
            name: String,
            hash: String,
            uploadDate: Date
        }]
    },
    
    // Statistics
    totalClaims: {
        type: Number,
        default: 0
    },
    totalPayouts: {
        type: String,
        default: '0'
    },
    
    // Additional fields for off-chain data
    personalInfo: {
        name: String,
        email: String,
        phone: String,
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        }
    },
    
    // Risk assessment
    riskScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 50
    },
    riskFactors: [String],
    
    // Premium calculation details
    basePremium: String,
    riskMultiplier: Number,
    discounts: [{
        type: String,
        amount: String,
        reason: String
    }],
    
    // Renewal information
    isRenewable: {
        type: Boolean,
        default: true
    },
    renewalDate: Date,
    renewalCount: {
        type: Number,
        default: 0
    },
    
    // Notifications
    notifications: [{
        type: String,
        message: String,
        date: Date,
        read: Boolean
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for efficient queries
policySchema.index({ holder: 1, status: 1 });
policySchema.index({ policyType: 1, status: 1 });
policySchema.index({ endDate: 1 });
policySchema.index({ blockchainId: 1 }, { unique: true });

// Virtual for checking if policy is active
policySchema.virtual('isActive').get(function() {
    return this.status === 'Active' && new Date() <= this.endDate;
});

// Virtual for days remaining
policySchema.virtual('daysRemaining').get(function() {
    if (this.status !== 'Active') return 0;
    const now = new Date();
    const end = new Date(this.endDate);
    const diffTime = end - now;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
});

// Pre-save middleware
policySchema.pre('save', function(next) {
    // Auto-expire policies
    if (new Date() > this.endDate && this.status === 'Active') {
        this.status = 'Expired';
    }
    next();
});

// Static methods
policySchema.statics.findByHolder = function(holderAddress) {
    return this.find({ holder: holderAddress.toLowerCase() });
};

policySchema.statics.findExpiringSoon = function(days = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return this.find({
        status: 'Active',
        endDate: { $lte: futureDate, $gte: new Date() }
    });
};

policySchema.statics.getStatsByType = function() {
    return this.aggregate([
        {
            $group: {
                _id: '$policyType',
                count: { $sum: 1 },
                totalPremium: { $sum: { $toDouble: '$premium' } },
                totalCoverage: { $sum: { $toDouble: '$coverage' } }
            }
        }
    ]);
};

// Instance methods
policySchema.methods.addNotification = function(type, message) {
    this.notifications.push({
        type,
        message,
        date: new Date(),
        read: false
    });
    return this.save();
};

policySchema.methods.calculateRenewalPremium = function() {
    // Basic renewal calculation - can be enhanced
    const basePremium = parseFloat(this.basePremium || this.premium);
    const riskAdjustment = this.riskScore > 50 ? 1.1 : 0.95;
    const renewalAdjustment = 1 + (this.renewalCount * 0.02); // 2% increase per renewal
    
    return (basePremium * riskAdjustment * renewalAdjustment).toString();
};

const Policy = mongoose.model('Policy', policySchema);
module.exports = Policy;