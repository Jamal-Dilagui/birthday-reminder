import { connectMongoDb } from './mongodb';
import Birthday from '../models/birthday';
import User from '../models/user';
import { whatsappService } from './whatsapp';

export class BirthdayReminderService {
  // Check for birthdays that need reminders
  async checkBirthdayReminders() {
    try {
      await connectMongoDb();
      
      const today = new Date();
      
      // Get all birthdays with reminders enabled
      const birthdays = await Birthday.find({
        reminderSettings: true
      }).populate('user', 'whatsappNumber name');
      
      const remindersToSend = [];
      
      for (const birthday of birthdays) {
        const birthdayDate = new Date(birthday.date);
        
        // Calculate days until birthday
        const daysUntil = this.calculateDaysUntil(birthdayDate);
        
        // Check if reminder should be sent based on notifyBeforeDays setting
        if (this.shouldSendReminder(daysUntil, birthday.notifyBeforeDays)) {
          remindersToSend.push({
            birthday,
            daysUntil,
            type: daysUntil === 0 ? 'birthday' : 'reminder',
            userWhatsApp: birthday.user?.whatsappNumber
          });
        }
      }
      
      return remindersToSend;
    } catch (error) {
      console.error('Error checking birthday reminders:', error);
      throw error;
    }
  }
  
  // Calculate days until birthday
  calculateDaysUntil(birthdayDate) {
    const today = new Date();
    const nextBirthday = new Date(birthdayDate);
    
    // Set next birthday to this year
    nextBirthday.setFullYear(today.getFullYear());
    
    // If birthday has passed this year, set to next year
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    const diffTime = nextBirthday - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }
  
  // Check if reminder should be sent
  shouldSendReminder(daysUntil, notifyBeforeDays) {
    // Send on the day of birthday
    if (daysUntil === 0) return true;
    
    // Send based on notifyBeforeDays setting
    switch (notifyBeforeDays) {
      case 0: // Same day only
        return daysUntil === 0;
      case 1: // 1 day before
        return daysUntil === 1;
      case 7: // 1 week before
        return daysUntil === 7;
      default:
        return false;
    }
  }
  
  // Send all pending reminders
  async sendReminders() {
    try {
      const reminders = await this.checkBirthdayReminders();
      const results = [];
      
      for (const reminder of reminders) {
        try {
          let result;
          
          // Use the user's WhatsApp number to send the reminder
          const userWhatsApp = reminder.userWhatsApp;
          
          if (!userWhatsApp) {
            results.push({
              success: false,
              birthday: reminder.birthday.name,
              error: 'User WhatsApp number not found'
            });
            continue;
          }
          
          if (reminder.type === 'birthday') {
            // Send birthday message to the user
            result = await whatsappService.sendBirthdayMessage(
              userWhatsApp, 
              reminder.birthday.customMessage.replace('{name}', reminder.birthday.name)
            );
          } else {
            // Send upcoming reminder to the user
            const message = this.getUpcomingReminderMessage(reminder.birthday.name, reminder.daysUntil);
            result = await whatsappService.sendBirthdayMessage(userWhatsApp, message);
          }
          
          results.push({
            success: true,
            birthday: reminder.birthday.name,
            type: reminder.type,
            sentTo: userWhatsApp,
            result
          });
          
          console.log(`✅ Reminder sent for ${reminder.birthday.name} to ${userWhatsApp}`);
        } catch (error) {
          results.push({
            success: false,
            birthday: reminder.birthday.name,
            error: error.message
          });
          
          console.error(`❌ Failed to send reminder for ${reminder.birthday.name}:`, error);
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error sending reminders:', error);
      throw error;
    }
  }
  
  // Get message for upcoming birthday reminder
  getUpcomingReminderMessage(name, daysUntil) {
    if (daysUntil === 0) {
      return `🎉 Today is ${name}'s birthday! Don't forget to send your wishes!`;
    } else if (daysUntil === 1) {
      return `📅 Tomorrow is ${name}'s birthday! Get ready to celebrate!`;
    } else {
      return `📅 ${name}'s birthday is in ${daysUntil} days! Mark your calendar!`;
    }
  }
  
  // Send test message
  async sendTestMessage(whatsappNumber, message) {
    try {
      return await whatsappService.sendBirthdayMessage(whatsappNumber, message);
    } catch (error) {
      console.error('Error sending test message:', error);
      throw error;
    }
  }
}

export const birthdayReminderService = new BirthdayReminderService(); 