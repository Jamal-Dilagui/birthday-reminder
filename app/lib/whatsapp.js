// WhatsApp messaging utility
// You'll need to integrate with a WhatsApp API service like Twilio, WhatsApp Business API, or similar

export class WhatsAppService {
  constructor() {
    // Initialize with your WhatsApp API credentials
    this.apiKey = process.env.WHATSAPP_API_KEY;
    this.apiUrl = process.env.WHATSAPP_API_URL;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  }

  // Send a birthday message
  async sendBirthdayMessage(toNumber, message) {
    try {
      const response = await fetch(`${this.apiUrl}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: toNumber,
          type: 'text',
          text: { body: message }
        })
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('WhatsApp message sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  // Send birthday reminder
  async sendBirthdayReminder(birthdayData) {
    const { name, whatsappNumber, customMessage } = birthdayData;
    
    // Replace placeholder in custom message
    const message = customMessage.replace('{name}', name);
    
    return await this.sendBirthdayMessage(whatsappNumber, message);
  }

  // Send reminder for upcoming birthday
  async sendUpcomingBirthdayReminder(birthdayData, daysUntil) {
    const { name, whatsappNumber } = birthdayData;
    
    let message;
    if (daysUntil === 0) {
      message = `🎉 Today is ${name}'s birthday! Don't forget to send your wishes!`;
    } else if (daysUntil === 1) {
      message = `📅 Tomorrow is ${name}'s birthday! Get ready to celebrate!`;
    } else {
      message = `📅 ${name}'s birthday is in ${daysUntil} days! Mark your calendar!`;
    }
    
    return await this.sendBirthdayMessage(whatsappNumber, message);
  }
}

// Alternative: Simple WhatsApp Web API (for testing)
export class WhatsAppWebService {
  async sendMessage(toNumber, message) {
    // This is a placeholder for WhatsApp Web API integration
    // You would need to implement actual WhatsApp Web API calls
    console.log(`Sending message to ${toNumber}: ${message}`);
    
    // For now, just log the message
    return {
      success: true,
      message: 'Message logged (WhatsApp integration pending)',
      to: toNumber,
      content: message
    };
  }

  async sendBirthdayReminder(birthdayData) {
    const { name, whatsappNumber, customMessage } = birthdayData;
    const message = customMessage.replace('{name}', name);
    return await this.sendMessage(whatsappNumber, message);
  }
}

// Export the appropriate service based on environment
export const whatsappService = process.env.NODE_ENV === 'production' 
  ? new WhatsAppService() 
  : new WhatsAppWebService(); 