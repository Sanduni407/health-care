import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
  totalAmount: { type: Number, required: true, default: 0 },
  paidAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'paid', 'partially_paid', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, enum: ['cash', 'card', 'online', 'insurance'], default: null },
  transactionId: { type: String },
  paidAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

billSchema.index({ patient: 1, status: 1 });
billSchema.index({ createdAt: -1 });

billSchema.pre('save', function(next) { 
  this.updatedAt = Date.now(); 
  next(); 
});

export default mongoose.models.Bill || mongoose.model('Bill', billSchema);