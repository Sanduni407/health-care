import mongoose from "mongoose";


const availabilityTemplateSchema = new mongoose.Schema({
doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
// 0 (Sunday) - 6 (Saturday)
dayOfWeek: { type: Number, required: true },
startTime: { type: String, required: true }, // "09:00"
endTime: { type: String, required: true }, // "12:00"
createdAt: { type: Date, default: Date.now }
});


availabilityTemplateSchema.index({ doctor: 1, dayOfWeek: 1, startTime: 1 });


export default mongoose.models.AvailabilityTemplate || mongoose.model('AvailabilityTemplate', availabilityTemplateSchema);