const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
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
    
    // Claim details
    policyId: {
        type: Number,
        required: true
    },
    policyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Policy',
        required: true
    },
    claimant: {
        type: String, // Ethereum address
        required: true,
        lowercase: true
    },
    amount: {
        type: String, // Store as string to handle big numbers
        required: true
    },
    description: {
        type: String,
        required: true,
        maxLength: 1000
    },
    
    // Evidence and documentation
    evidenceHash: {
        type: String, // IPFS hash
        default: ''
    },
    evidence: {
        documents: [{
            name: String,
            hash: String,
            type: String, // 'image', 'pdf', 'video', etc.
            size: Number,
            uploadDate: Date
        }],
        photos: [{
            hash: String,
            caption: String,
            location: {
                latitude: Number,
                longitude: Number
            },
            timestamp: Date
        }],
        reports: [{
            type: String, // 'police', 'medical', 'inspection', etc.
            hash: String,
            reportNumber: String,
            issuer: String,
            date: Date
        }]
    },
    
    // Status and processing
    status: {
        type: String,
        enum: ['Pending', 'UnderReview', 'Approved', 'Rejected', 'Paid'],
        default: 'Pending'
    },
    filedDate: {
        type: Date,
        required: true
    },
    processedDate: Date,
    rejectionReason: String,
    
    // Assessment details
    assessment: {
        adjuster: {
            address: String,
            name: String,
            licenseNumber: String
        },
        assessmentDate: Date,
        assessedAmount: String,
        assessmentNotes: String,
        riskFactors: [String],
        fraudScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        }
    },
    
    // Payment details
    payment: {
        method: String, // 'blockchain', 'bank_transfer', etc.
        transactionHash: String,
        paymentDate: Date,
        fees: String,
        netAmount: String
    },
    
    // Incident details
    incident: {
        date: Date,
        location: {
            address: String,
            city: String,
            state: String,
            country: String,
            coordinates: {
                latitude: Number,
                longitude: Number
            }
        },
        description: String,
        witnesses: [{
            name: String,
            contact: String,
            statement: String
        }],
        policeReportNumber: String,
        weatherConditions: String,
        timeOfDay: String
    },
    
    // Communication history
    communications: [{
        from: String, // 'claimant', 'adjuster', 'system'
        to: String,
        message: String,
        date: Date,
        type: String, // 'email', 'sms', 'call', 'system'
        attachments: [{
            name: String,
            hash: String
        }]
    }],
    
    // Workflow tracking
    workflow: {
        currentStep: String,
        steps: [{
            name: String,
            status: String, // 'pending', 'completed', 'skipped'
            completedDate: Date,
            assignedTo: String,
            notes: String
        }],
        sla: {
            targetResolutionDate: Date,
            actualResolutionDate: Date,
            breached: Boolean
        }
    },
    
    // Fraud detection
    fraudFlags: [{
        type: String,
        severity: String, // 'low', 'medium', 'high'
        description: String,
        flaggedDate: Date,
        resolved: Boolean
    }],
    
    // Notifications
    notifications: [{
        type: String,
        message: String,
        date: Date,
        sent: Boolean,
        channel: String // 'email', 'sms', 'push'
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for efficient queries
claimSchema.index({ claimant: 1, status: 1 });
claimSchema.index({ policyId: 1 });
claimSchema.index({ status: 1, filedDate: -1 });
claimSchema.index({ blockchainId: 1 }, { unique: true });
claimSchema.index({ 'assessment.fraudScore': -1 });

// Virtual for processing time
claimSchema.virtual('processingDays').get(function() {
    if (!this.processedDate) return null;
    const diffTime = this.processedDate - this.filedDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for SLA status
claimSchema.virtual('slaStatus').get(function() {
    if (!this.workflow.sla.targetResolutionDate) return 'no_sla';
    const now = new Date();
    const target = this.workflow.sla.targetResolutionDate;
    
    if (this.status === 'Paid' || this.status === 'Rejected') {
        return this.workflow.sla.breached ? 'breached' : 'met';
    }
    
    return now > target ? 'at_risk' : 'on_track';
});

// Pre-save middleware
claimSchema.pre('save', function(next) {
    // Update SLA breach status
    if (this.workflow.sla.targetResolutionDate && 
        (this.status === 'Paid' || this.status === 'Rejected') &&
        this.processedDate > this.workflow.sla.targetResolutionDate) {
        this.workflow.sla.breached = true;
        this.workflow.sla.actualResolutionDate = this.processedDate;
    }
    
    // Set default workflow steps based on claim type
    if (this.isNew && (!this.workflow.steps || this.workflow.steps.length === 0)) {
        this.workflow.steps = [
            { name: 'Initial Review', status: 'pending' },
            { name: 'Document Verification', status: 'pending' },
            { name: 'Assessment', status: 'pending' },
            { name: 'Decision', status: 'pending' },
            { name: 'Payment Processing', status: 'pending' }
        ];
        this.workflow.currentStep = 'Initial Review';
    }
    
    next();
});

// Static methods
claimSchema.statics.findByClaimant = function(claimantAddress) {
    return this.find({ claimant: claimantAddress.toLowerCase() });
};

claimSchema.statics.findPendingClaims = function() {
    return this.find({ 
        status: { $in: ['Pending', 'UnderReview'] } 
    }).sort({ filedDate: 1 });
};

claimSchema.statics.getClaimStatistics = function() {
    return this.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalAmount: { $sum: { $toDouble: '$amount' } },
                avgProcessingTime: { $avg: '$processingDays' }
            }
        }
    ]);
};

claimSchema.statics.findHighRiskClaims = function() {
    return this.find({
        $or: [
            { 'assessment.fraudScore': { $gte: 70 } },
            { 'fraudFlags.severity': 'high' }
        ]
    });
};

// Instance methods
claimSchema.methods.addCommunication = function(from, to, message, type = 'system') {
    this.communications.push({
        from,
        to,
        message,
        date: new Date(),
        type
    });
    return this.save();
};

claimSchema.methods.updateWorkflowStep = function(stepName, status, assignedTo, notes) {
    const step = this.workflow.steps.find(s => s.name === stepName);
    if (step) {
        step.status = status;
        step.assignedTo = assignedTo;
        step.notes = notes;
        if (status === 'completed') {
            step.completedDate = new Date();
        }
    }
    
    // Update current step
    const nextPendingStep = this.workflow.steps.find(s => s.status === 'pending');
    this.workflow.currentStep = nextPendingStep ? nextPendingStep.name : 'Completed';
    
    return this.save();
};

claimSchema.methods.addFraudFlag = function(type, severity, description) {
    this.fraudFlags.push({
        type,
        severity,
        description,
        flaggedDate: new Date(),
        resolved: false
    });
    
    // Update fraud score based on flags
    const highFlags = this.fraudFlags.filter(f => f.severity === 'high' && !f.resolved).length;
    const mediumFlags = this.fraudFlags.filter(f => f.severity === 'medium' && !f.resolved).length;
    const lowFlags = this.fraudFlags.filter(f => f.severity === 'low' && !f.resolved).length;
    
    this.assessment.fraudScore = Math.min(100, (highFlags * 30) + (mediumFlags * 15) + (lowFlags * 5));
    
    return this.save();
};

claimSchema.methods.calculateSLA = function() {
    // Default SLA: 30 days for standard claims, 15 days for simple claims
    const claimAmount = parseFloat(this.amount);
    const isSimpleClaim = claimAmount < 1000; // Configurable threshold
    
    const slaDays = isSimpleClaim ? 15 : 30;
    const targetDate = new Date(this.filedDate);
    targetDate.setDate(targetDate.getDate() + slaDays);
    
    this.workflow.sla.targetResolutionDate = targetDate;
    return this.save();
};

const Claim = mongoose.model('Claim', claimSchema);
module.exports = Claim;