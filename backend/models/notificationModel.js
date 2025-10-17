import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: [
      'appointment_cancelled', 
      'appointment_confirmed', 
      'appointment_reminder', 
      'doctor_unavailable',
      'urgent_response',      // NEW
      'concern_flagged'       // NEW
    ], 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  feedbackId: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' },              // NEW
  urgentResponseId: { type: mongoose.Schema.Types.ObjectId, ref: 'UrgentResponse' },  // NEW
  flaggedConcernId: { type: mongoose.Schema.Types.ObjectId, ref: 'FlaggedConcern' },  // NEW
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);