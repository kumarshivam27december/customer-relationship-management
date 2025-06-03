const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const Customer = require('../models/Customer');
const CommunicationLog = require('../models/CommunicationLog');
const vendorService = require('../services/vendorService');

// Get all campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Helper function to evaluate a condition
const evaluateCondition = (customer, condition) => {
  const { field, operator, value } = condition;
  const customerValue = customer[field];

  switch (operator) {
    case '>': return customerValue > value;
    case '<': return customerValue < value;
    case '>=': return customerValue >= value;
    case '<=': return customerValue <= value;
    case '==': return customerValue === value;
    default: return false;
  }
};

// Helper function to evaluate segment rules
const evaluateSegmentRules = (customer, rules) => {
  const { operator, conditions } = rules;
  
  if (operator === 'AND') {
    return conditions.every(condition => evaluateCondition(customer, condition));
  } else {
    return conditions.some(condition => evaluateCondition(customer, condition));
  }
};

// Create new campaign
router.post('/', async (req, res) => {
  const campaign = new Campaign({
    name: req.body.name,
    segmentRules: req.body.segmentRules,
    message: req.body.message,
    status: 'sending' // Set initial status to sending
  });

  try {
    // Calculate audience size based on segment rules
    const customers = await Customer.find();
    const matchingCustomers = customers.filter(customer => 
      evaluateSegmentRules(customer, req.body.segmentRules)
    );

    campaign.stats.totalAudience = matchingCustomers.length;
    const newCampaign = await campaign.save();

    // Create communication logs and send messages
    for (const customer of matchingCustomers) {
      try {
        const personalizedMessage = req.body.message.replace('{name}', customer.name);
        
        // Create communication log
        const log = new CommunicationLog({
          campaignId: newCampaign._id,
          customerId: customer._id,
          message: personalizedMessage,
          status: 'pending'
        });
        await log.save();

        // Send message through vendor service
        const result = await vendorService.sendMessage(personalizedMessage, customer);
        
        // Update communication log with vendor message ID
        await CommunicationLog.findByIdAndUpdate(log._id, {
          vendorMessageId: result.vendorMessageId,
          status: result.success ? 'sent' : 'failed',
          error: result.error
        });

        // Update campaign stats
        if (result.success) {
          campaign.stats.sent += 1;
        } else {
          campaign.stats.failed += 1;
        }
        await campaign.save();
      } catch (error) {
        console.error(`Error sending message to customer ${customer._id}:`, error);
        await CommunicationLog.findOneAndUpdate(
          { campaignId: newCampaign._id, customerId: customer._id },
          { status: 'failed', error: error.message }
        );
        campaign.stats.failed += 1;
        await campaign.save();
      }
    }

    // Update campaign status to completed
    campaign.status = 'completed';
    await campaign.save();

    res.status(201).json(newCampaign);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Preview audience size
router.post('/preview', async (req, res) => {
  try {
    const customers = await Customer.find();
    const matchingCustomers = customers.filter(customer => 
      evaluateSegmentRules(customer, req.body.segmentRules)
    );

    res.json({
      audienceSize: matchingCustomers.length,
      sampleCustomers: matchingCustomers.slice(0, 5) // Return first 5 matching customers as sample
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get campaign details
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Get delivery stats
    const stats = await CommunicationLog.aggregate([
      { $match: { campaignId: campaign._id } },
      { $group: {
        _id: '$status',
        count: { $sum: 1 }
      }}
    ]);

    // Update campaign stats
    const updatedStats = {
      totalAudience: campaign.stats.totalAudience,
      sent: 0,
      failed: 0
    };

    stats.forEach(stat => {
      if (stat._id === 'sent') updatedStats.sent = stat.count;
      if (stat._id === 'failed') updatedStats.failed = stat.count;
    });

    campaign.stats = updatedStats;
    await campaign.save();

    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get campaign logs
router.get('/:id/logs', async (req, res) => {
  try {
    const logs = await CommunicationLog.find({ campaignId: req.params.id })
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 