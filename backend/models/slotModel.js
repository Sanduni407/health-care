import mongoose from "mongoose";


const slotSchema = new mongoose.Schema({
doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
start: { type: Date, required: true },
end: { type: Date, required: true },
isBooked: { type: Boolean, default: false },
appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', default: null },
source: { type: String }, // e.g. templateId or oneOffId
createdAt: { type: Date, default: Date.now }
});


slotSchema.index({ doctor: 1, start: 1 });
slotSchema.index({ start: 1, isBooked: 1 });


export default mongoose.models.Slot || mongoose.model('Slot', slotSchema);