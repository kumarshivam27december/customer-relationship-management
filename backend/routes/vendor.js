const express = require('express');
const router = express.Router();
const CommunicationLog = require('../models/CommunicationLog');

// Batch size for processing delivery receipts
const BATCH_SIZE = 10;
let receiptQueue = [];

// Process receipt queue periodically
setInterval(async () => {
  if (receiptQueue.length > 0) {
    const batch = receiptQueue.splice(0, BATCH_SIZE);
    try {
      await CommunicationLog.bulkWrite(
        batch.map(receipt => ({
          updateOne: {
            filter: { vendorMessageId: receipt.vendorMessageId },
            update: {
              $set: {
                status: receipt.status,
                error: receipt.error,
                sentAt: receipt.status === 'sent' ? new Date() : null
              }
            }
          }
        }))
      );
      console.log(`Processed ${batch.length} delivery receipts`);
    } catch (error) {
      console.error('Error processing delivery receipts:', error);
      // Put failed receipts back in queue
      receiptQueue.unshift(...batch);
    }
  }
}, 5000); // Process every 5 seconds

// Delivery receipt endpoint
router.post('/receipt', async (req, res) => {
  const { vendorMessageId, status, error } = req.body;

  if (!vendorMessageId || !status) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Add to receipt queue
  receiptQueue.push({
    vendorMessageId,
    status,
    error
  });

  res.status(200).json({ message: 'Receipt queued for processing' });
});

module.exports = router; 