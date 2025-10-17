import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, trim: true },
  note: { type: String, required: true },
  attachment: { type: String }, // path to uploaded image
  tag: { type: String, enum: ["urgent", "remark", "concern"], required: true },
  rating: { type: Number, min: 1, max: 5 }, // only for 'remark' tag
  status: { type: String, enum: ["pending", "reviewed"], default: "pending" },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);