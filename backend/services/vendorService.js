const axios = require('axios');

class VendorService {
  constructor() {
    this.baseUrl = process.env.VENDOR_API_URL || 'http://localhost:5000/api/vendor';
  }

  async sendMessage(message, customer) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));

      // Simulate 90% success rate
      const isSuccess = Math.random() < 0.9;

      if (isSuccess) {
        // Simulate successful delivery
        const vendorMessageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Simulate async delivery receipt
        setTimeout(() => {
          this.sendDeliveryReceipt(vendorMessageId, 'sent');
        }, 1000);

        return {
          success: true,
          vendorMessageId
        };
      } else {
        // Simulate failed delivery
        const vendorMessageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Simulate async delivery receipt
        setTimeout(() => {
          this.sendDeliveryReceipt(vendorMessageId, 'failed', 'Message delivery failed');
        }, 1000);

        return {
          success: false,
          vendorMessageId,
          error: 'Message delivery failed'
        };
      }
    } catch (error) {
      console.error('Vendor API Error:', error);
      throw error;
    }
  }

  async sendDeliveryReceipt(vendorMessageId, status, error = null) {
    try {
      await axios.post(`${this.baseUrl}/receipt`, {
        vendorMessageId,
        status,
        error
      });
    } catch (error) {
      console.error('Error sending delivery receipt:', error);
    }
  }
}

module.exports = new VendorService(); 