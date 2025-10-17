import * as communityService from "../services/communityService.js";

// Create post
export const createPost = async (req, res) => {
  try {
    const postData = {
      ...req.body,
      doctor: req.user.id,
      image: req.file ? `/uploads/community/${req.file.filename}` : undefined,
      categories: JSON.parse(req.body.categories || "[]")
    };
    
    const post = await communityService.createPost(postData);
    res.json({ success: true, post });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Get all posts (community feed)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await communityService.getAllPosts();
    res.json({ success: true, posts });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Get doctor's posts
export const getDoctorPosts = async (req, res) => {
  try {
    const posts = await communityService.getDoctorPosts(req.user.id);
    res.json({ success: true, posts });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Get single post
export const getPostDetails = async (req, res) => {
  try {
    const post = await communityService.getPostDetails(req.params.id);
    res.json({ success: true, post });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      categories: JSON.parse(req.body.categories || "[]")
    };
    
    if (req.file) {
      updateData.image = `/uploads/community/${req.file.filename}`;
    }
    
    const post = await communityService.updatePost(
      req.params.id,
      req.user.id,
      updateData
    );
    res.json({ success: true, post });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    await communityService.deletePost(req.params.id, req.user.id);
    res.json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Toggle reaction
export const toggleReaction = async (req, res) => {
  try {
    const post = await communityService.toggleReaction(req.params.id, req.user.id);
    res.json({ success: true, post });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Add comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await communityService.addComment(req.params.id, req.user.id, text);
    res.json({ success: true, post });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const post = await communityService.deleteComment(
      req.params.postId,
      req.params.commentId,
      req.user.id
    );
    res.json({ success: true, post });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};