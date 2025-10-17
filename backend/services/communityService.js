import * as communityRepo from "../repositories/communityRepository.js";
import * as authRepo from "../repositories/authRepository.js";
import * as doctorRepo from "../repositories/doctorRepository.js";

// Create post
export const createPost = async (postData) => {
  return await communityRepo.createPost(postData);
};

// Get all posts
export const getAllPosts = async () => {
  return await communityRepo.getAllPosts();
};

// Get posts by doctor
export const getDoctorPosts = async (doctorId) => {
  return await communityRepo.getPostsByDoctor(doctorId);
};

// Get single post
export const getPostDetails = async (postId) => {
  const post = await communityRepo.getPostById(postId);
  if (!post) throw new Error("Post not found");
  return post;
};

// Update post
export const updatePost = async (postId, doctorId, updateData) => {
  const post = await communityRepo.getPostById(postId);
  if (!post) throw new Error("Post not found");
  if (post.doctor._id.toString() !== doctorId.toString()) {
    throw new Error("Not authorized to update this post");
  }
  
  return await communityRepo.updatePost(postId, updateData);
};

// Delete post
export const deletePost = async (postId, doctorId) => {
  const post = await communityRepo.getPostById(postId);
  if (!post) throw new Error("Post not found");
  if (post.doctor._id.toString() !== doctorId.toString()) {
    throw new Error("Not authorized to delete this post");
  }
  
  return await communityRepo.deletePost(postId);
};

// Toggle reaction
export const toggleReaction = async (postId, userId) => {
  const updatedPost = await communityRepo.addReaction(postId, userId);
  
  // Get the full post with populated data AND doctor image
  const fullPost = await communityRepo.getPostById(updatedPost._id);
  
  // Fetch doctor profile with image
  const doctorProfile = await doctorRepo.findByUserId(fullPost.doctor._id);
  
  return {
    ...fullPost.toObject(),
    doctor: {
      _id: fullPost.doctor._id,
      name: fullPost.doctor.name,
      image: doctorProfile?.image || null
    }
  };
};

// Add comment
export const addComment = async (postId, userId, text) => {
  if (!text || !text.trim()) throw new Error("Comment text is required");
  
  const updatedPost = await communityRepo.addComment(postId, userId, text);
  
  // Get the full post with populated data AND doctor image
  const fullPost = await communityRepo.getPostById(updatedPost._id);
  
  // Fetch doctor profile with image
  const doctorProfile = await doctorRepo.findByUserId(fullPost.doctor._id);
  
  return {
    ...fullPost.toObject(),
    doctor: {
      _id: fullPost.doctor._id,
      name: fullPost.doctor.name,
      image: doctorProfile?.image || null
    }
  };
};

// Delete comment
export const deleteComment = async (postId, commentId, userId) => {
  const post = await communityRepo.getPostById(postId);
  if (!post) throw new Error("Post not found");
  
  const comment = post.comments.find(c => c._id.toString() === commentId.toString());
  if (!comment) throw new Error("Comment not found");
  
  // Only comment owner can delete
  if (comment.user._id.toString() !== userId.toString()) {
    throw new Error("Not authorized to delete this comment");
  }
  
  const updatedPost = await communityRepo.deleteComment(postId, commentId);
  
  // Get the full post with populated data AND doctor image
  const fullPost = await communityRepo.getPostById(updatedPost._id);
  
  // Fetch doctor profile with image
  const doctorProfile = await doctorRepo.findByUserId(fullPost.doctor._id);
  
  return {
    ...fullPost.toObject(),
    doctor: {
      _id: fullPost.doctor._id,
      name: fullPost.doctor.name,
      image: doctorProfile?.image || null
    }
  };
};