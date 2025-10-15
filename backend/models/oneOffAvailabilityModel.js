import mongoose from "mongoose";


const oneOffAvailabilitySchema = new mongoose.Schema({
doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
date: { type: Date, required: true }, // date-only (time disregarded)
startTime: { type: String }, // optional if marking full-day unavailable
endTime: { type: String },
type: { type: String, enum: ['available', 'unavailable'], required: true },
createdAt: { type: Date, default: Date.now }
});


oneOffAvailabilitySchema.index({ doctor: 1, date: 1 });


export default mongoose.models.OneOffAvailability || mongoose.model('OneOffAvailability', oneOffAvailabilitySchema);