import mongoose from "mongoose";

const communityPostSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  caption: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  image: { type: String }, // path to uploaded image
  categories: [{ 
    type: String, 
    enum: ["lifestyle", "disease", "prevention", "treatment"],
    required: true 
  }],
  reactions: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now }
  }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.CommunityPost || mongoose.model("CommunityPost", communityPostSchema);