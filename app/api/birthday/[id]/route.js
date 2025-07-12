import { NextResponse } from 'next/server';
import { connectMongoDb } from '@/app/lib/mongodb';
import Birthday from '@/app/models/birthday';

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