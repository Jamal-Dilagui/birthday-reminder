import { NextResponse } from 'next/server';
import { birthdayReminderService } from '@/app/lib/birthdayReminder';

// This endpoint will be called by Vercel Cron daily
// Add this to your vercel.json:
// {
//   "crons": [{
//     "path": "/api/cron/check-birthdays",
//     "schedule": "0 9 * * *"
//   }]
// }

export async function GET(request) {
  try {
    console.log('🕐 Cron job started: Checking for birthday reminders...');
    
    // Check for birthdays that need reminders
    const reminders = await birthdayReminderService.checkBirthdayReminders();
    
    if (reminders.length === 0) {
      console.log('✅ No birthday reminders to send today');
      return NextResponse.json({
        success: true,
        message: 'No birthday reminders to send today',
        checkedAt: new Date().toISOString(),
        remindersFound: 0
      });
    }
    
    console.log(`📅 Found ${reminders.length} birthday(s) that need reminders`);
    
    // Send all reminders
    const results = await birthdayReminderService.sendReminders();
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`✅ Sent ${successful.length} reminders successfully`);
    if (failed.length > 0) {
      console.log(`❌ Failed to send ${failed.length} reminders`);
    }
    
    return NextResponse.json({
      success: true,
      message: `Processed ${results.length} birthday reminders`,
      checkedAt: new Date().toISOString(),
      results: {
        total: results.length,
        successful: successful.length,
        failed: failed.length,
        details: results
      }
    });
    
  } catch (error) {
    console.error('❌ Cron job error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process birthday reminders',
        details: error.message,
        checkedAt: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Also allow POST for manual triggering
export async function POST(request) {
  return GET(request);
} 