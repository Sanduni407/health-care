import mongoose from 'mongoose';


const appointmentSchema = new mongoose.Schema({
patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
slot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
start: { type: Date, required: true },
end: { type: Date, required: true },
reason: { type: String },
phone: { type: String },
status: { type: String, enum: ['booked','cancelled','completed'], default: 'booked' },
paymentStatus: { type: String, enum: ['pending','paid','refunded','cancelled'], default: 'pending' },
createdAt: { type: Date, default: Date.now },
cancelledAt: { type: Date }
});


appointmentSchema.index({ patient: 1, start: 1 });
appointmentSchema.index({ doctor: 1, start: 1 });


export default mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);