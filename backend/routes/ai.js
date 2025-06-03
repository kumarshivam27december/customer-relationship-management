const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateMessageSuggestions } = require('../services/aiService');

// Get message suggestions
router.post('/suggest-messages', auth, async (req, res) => {
  try {
    const { campaignObjective, audienceSegment } = req.body;

    if (!campaignObjective) {
      return res.status(400).json({ message: 'Campaign objective is required' });
    }

    const suggestions = await generateMessageSuggestions(
      campaignObjective,
      audienceSegment || 'General audience'
    );

    res.json({ suggestions });
  } catch (error) {
    console.error('Error in suggest-messages route:', error);
    res.status(500).json({ message: 'Failed to generate message suggestions' });
  }
});

module.exports = router; 