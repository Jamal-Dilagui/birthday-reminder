import { NextResponse } from 'next/server';
import { connectMongoDb } from '@/app/lib/mongodb';
import Birthday from '@/app/models/birthday';



// Helper for error responses
const errorResponse = (message, status = 400) => {
  return NextResponse.json({ success: false, error: message }, { status });
};

// CREATE - POST /api/birthdays
export async function POST(request) {
  try {
    await connectMongoDb();
    const { 
      name, 
      date, 
      whatsappNumber, 
      userId,
      reminderSettings = true,
      notifyBeforeDays = 0,
      reminderTime = '09:00',
      customMessage = 'Happy Birthday, {name}! 🎉'
    } = await request.json();

     // Validate ObjectId
    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //   return NextResponse.json(
    //     { error: 'Invalid user ID format' },
    //     { status: 400 }
    //   )
    // }

    // Validation
    if (!name || !date || !whatsappNumber || !userId) {
      return errorResponse('Missing required fields');
    }

    // Create new birthday with reminder settings
    const birthday = await Birthday.create({
      name,
      date: new Date(date),
      whatsappNumber,
      user: userId,
      reminderSettings,
      notifyBeforeDays,
      reminderTime,
      customMessage
    });

    return NextResponse.json(
      { 
        success: true, 
        data: {
          ...birthday.toObject(),
          formattedDate: birthday.formattedDate
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create birthday error:', error);
    return errorResponse(error.message.includes('validation failed') 
      ? error.message 
      : 'Failed to create birthday', 
    500);
  }
}

// READ - GET /api/birthdays?userId=123
export async function GET(request) {
  try {
    await connectMongoDb();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return errorResponse('User ID is required');
    }

    // Get birthdays with virtual field
    const birthdays = await Birthday.find({ user: userId })
      .sort({ date: 1 })
      .exec();

    return NextResponse.json({ 
      success: true, 
      data: birthdays.map(b => ({
        ...b.toObject(),
        formattedDate: b.formattedDate
      }))
    });

  } catch (error) {
    console.error('Get birthdays error:', error);
    return errorResponse('Failed to fetch birthdays', 500);
  }
}

// UPDATE - PATCH /api/birthdays/:id
export async function PATCH(request, { params }) {
  try {
    await connectMongoDb();
    const { id } = params;
    const updateData = await request.json();

    // Validate date format if provided
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
      if (isNaN(updateData.date.getTime())) {
        return errorResponse('Invalid date format');
      }
    }

    // Validate reminderTime if provided
    if (updateData.reminderTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(updateData.reminderTime)) {
      return errorResponse('Reminder time must be in HH:MM format');
    }

    const updatedBirthday = await Birthday.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true,
        runValidators: true 
      }
    );

    if (!updatedBirthday) {
      return errorResponse('Birthday not found', 404);
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        ...updatedBirthday.toObject(),
        formattedDate: updatedBirthday.formattedDate
      }
    });

  } catch (error) {
    console.error('Update birthday error:', error);
    return errorResponse(error.message.includes('validation failed') 
      ? error.message 
      : 'Failed to update birthday', 
    400);
  }
}

// DELETE - DELETE /api/birthdays/:id
export async function DELETE(request, { params }) {
  try {
    await connectMongoDb();
    const { id } = params;

    const deletedBirthday = await Birthday.findByIdAndDelete(id);

    if (!deletedBirthday) {
      return errorResponse('Birthday not found', 404);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Birthday deleted successfully' 
    });

  } catch (error) {
    console.error('Delete birthday error:', error);
    return errorResponse('Failed to delete birthday', 500);
  }
}