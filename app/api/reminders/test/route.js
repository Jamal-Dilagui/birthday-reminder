import { NextResponse } from 'next/server';
import { whatsappService } from '@/app/lib/whatsapp';

// POST /api/reminders/test - Send a test WhatsApp message
export async function POST(request) {
  try {
    const { whatsappNumber, message } = await request.json();
    
    if (!whatsappNumber || !message) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'WhatsApp number and message are required' 
        },
        { status: 400 }
      );
    }
    
    const result = await whatsappService.sendBirthdayMessage(whatsappNumber, message);
    
    return NextResponse.json({
      success: true,
      message: 'Test message sent successfully',
      result
    });
    
  } catch (error) {
    console.error('Error sending test message:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send test message',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 