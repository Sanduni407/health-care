import mongoose from "mongoose";

const flaggedConcernSchema = new mongoose.Schema({
  feedback: { type: mongoose.Schema.Types.ObjectId, ref: "Feedback", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  concern: { type: String, required: true },
  feedbackTitle: { type: String, required: true }, // store feedback title for display
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.FlaggedConcern || mongoose.model("FlaggedConcern", flaggedConcernSchema);