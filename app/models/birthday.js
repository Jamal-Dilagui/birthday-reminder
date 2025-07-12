import mongoose from 'mongoose';

const birthdaySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please enter the name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  date: {
    type: Date,
    required: [true, 'Please enter the birthday date']
  },
  whatsappNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\+[1-9]\d{1,14}$/.test(v);
      },
      message: props => `${props.value} is not a valid WhatsApp number!`
    }
  },
  reminderSettings: {
      type: Boolean,
      default: true
    },
   notifyBeforeDays: {
      type: Number,
      default: 0,
      enum: [0, 1, 7] // Same-day, 1-day before, 1-week before
    },
    reminderTime: {
      type: String,
      default: '09:00',
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Use HH:MM format']
    },
    customMessage: {
      type: String,
      default: 'Happy Birthday, {name}! 🎉',
      maxlength: [200, 'Message too long']
    },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
birthdaySchema.index({ user: 1, date: 1 });

// Virtual for formatted date (e.g., "12 March")
birthdaySchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric' 
  });
});

export default mongoose.models.Birthday || mongoose.model('Birthday', birthdaySchema);