import mongoose from "mongoose";

const healthRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recordType: {
    type: String,
    enum: ["blood", "pressure", "sugar", "cholesterol", "liver", "kidney", "thyroid"],
    required: true,
  },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileSize: { type: Number },
  uploadDate: { type: Date, default: Date.now },
  notes: { type: String },
});

export default mongoose.models.HealthRecord ||
  mongoose.model("HealthRecord", healthRecordSchema);