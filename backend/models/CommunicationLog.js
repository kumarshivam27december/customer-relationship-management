const mongoose = require('mongoose');

const communicationLogSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  },
  vendorMessageId: {
    type: String
  },
  error: {
    type: String
  },
  sentAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient querying
communicationLogSchema.index({ campaignId: 1, status: 1 });
communicationLogSchema.index({ vendorMessageId: 1 });

module.exports = mongoose.model('CommunicationLog', communicationLogSchema); 