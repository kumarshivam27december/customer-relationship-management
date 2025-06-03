const mongoose = require('mongoose');

const conditionSchema = new mongoose.Schema({
  field: {
    type: String,
    enum: ['totalSpent', 'visitCount', 'lastVisit'],
    required: true
  },
  operator: {
    type: String,
    enum: ['>', '<', '>=', '<=', '=='],
    required: true
  },
  value: {
    type: Number,
    required: true
  }
});

const segmentRulesSchema = new mongoose.Schema({
  operator: {
    type: String,
    enum: ['AND', 'OR'],
    required: true
  },
  conditions: [conditionSchema]
});

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  segmentRules: {
    type: segmentRulesSchema,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'sending', 'completed'],
    default: 'draft'
  },
  stats: {
    totalAudience: {
      type: Number,
      default: 0
    },
    sent: {
      type: Number,
      default: 0
    },
    failed: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Campaign', campaignSchema); 