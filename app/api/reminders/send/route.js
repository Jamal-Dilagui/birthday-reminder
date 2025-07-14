import { NextResponse } from 'next/server';
import { birthdayReminderService } from '@/app/lib/birthdayReminder';

// POST /api/reminders/send - Send all pending birthday reminders
export async function POST(request) {
  try {
    const results = await birthdayReminderService.sendReminders();
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    return NextResponse.json({
      success: true,
      message: `Sent ${successful.length} reminders successfully`,
      results: {
        successful,
        failed,
        total: results.length
      }
    });
    
  } catch (error) {
    console.error('Error in send reminders API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send reminders',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET /api/reminders/send - Check for pending reminders (without sending)
export async function GET() {
  try {
    const reminders = await birthdayReminderService.checkBirthdayReminders();
    
    return NextResponse.json({
      success: true,
      pendingReminders: reminders.length,
      reminders: reminders.map(r => ({
        name: r.birthday.name,
        daysUntil: r.daysUntil,
        type: r.type,
        date: r.birthday.date
      }))
    });
    
  } catch (error) {
    console.error('Error checking reminders:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check reminders',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 