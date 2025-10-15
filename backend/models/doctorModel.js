import mongoose from "mongoose";


const doctorSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
title: { type: String },
bio: { type: String },
education: [{ type: String }],
experienceYears: { type: Number },
specializations: [{ type: String, index: true }],
consultationDuration: { type: Number, default: 15 }, // minutes
image: { type: String }, // relative path or URL
fees: { type: Number, default: 0 },
createdAt: { type: Date, default: Date.now },
updatedAt: { type: Date, default: Date.now }
});


doctorSchema.pre('save', function(next) { this.updatedAt = Date.now(); next(); });


export default mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);