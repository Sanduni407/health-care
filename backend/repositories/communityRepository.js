import CommunityPost from "../models/communityPostModel.js";
import Doctor from "../models/doctorModel.js";

// Create post
export const createPost = (postData) => new CommunityPost(postData).save();

// Get all posts (for community feed) with doctor images

export const getAllPosts = async () => {
  const posts = await CommunityPost.find()
    .populate("doctor", "name")
    .populate("comments.user", "name")
    .populate("reactions.user", "name")
    .sort({ createdAt: -1 });

  // Fetch doctor profiles with images
  const postsWithImages = await Promise.all(
    posts.map(async (post) => {
      const doctorProfile = await Doctor.findOne({ user: post.doctor._id }).select('image');
      return {
        ...post.toObject(),
        doctor: {
          _id: post.doctor._id,
          name: post.doctor.name,
          image: doctorProfile?.image || null
        }
      };
    })
  );

  return postsWithImages;
};

// Get posts by doctor
export const getPostsByDoctor = (doctorId) =>
  CommunityPost.find({ doctor: doctorId })
    .populate("doctor", "name")
    .populate("comments.user", "name")
    .populate("reactions.user", "name")
    .sort({ createdAt: -1 });

// Get single post
export const getPostById = (postId) =>
  CommunityPost.findById(postId)
    .populate("doctor", "name")
    .populate("comments.user", "name")
    .populate("reactions.user", "name");

// Update post
export const updatePost = (postId, updateData) =>
  CommunityPost.findByIdAndUpdate(postId, updateData, { new: true })
    .populate("doctor", "name");

// Delete post
export const deletePost = (postId) => CommunityPost.findByIdAndDelete(postId);

// Add reaction
export const addReaction = async (postId, userId) => {
  const post = await CommunityPost.findById(postId);
  if (!post) throw new Error("Post not found");
  
  // Check if user already reacted
  const alreadyReacted = post.reactions.some(r => r.user.toString() === userId.toString());
  if (alreadyReacted) {
    // Remove reaction (unlike)
    post.reactions = post.reactions.filter(r => r.user.toString() !== userId.toString());
  } else {
    // Add reaction
    post.reactions.push({ user: userId });
  }
  
  return post.save();
};

// Add comment
export const addComment = async (postId, userId, text) => {
  const post = await CommunityPost.findById(postId);
  if (!post) throw new Error("Post not found");
  
  post.comments.push({ user: userId, text });
  return post.save();
};

// Delete comment
export const deleteComment = async (postId, commentId) => {
  const post = await CommunityPost.findById(postId);
  if (!post) throw new Error("Post not found");
  
  post.comments = post.comments.filter(c => c._id.toString() !== commentId.toString());
  return post.save();
};