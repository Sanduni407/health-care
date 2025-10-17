import axiosInstance from "./axiosInstance";

// Create post
export const createPost = async (formData) => {
  try {
    const res = await axiosInstance.post("/community/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Get all posts (community feed)
export const getAllPosts = async () => {
  try {
    const res = await axiosInstance.get("/community/posts");
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Get doctor's posts
export const getDoctorPosts = async () => {
  try {
    const res = await axiosInstance.get("/community/my-posts");
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Get single post
export const getPostDetails = async (postId) => {
  try {
    const res = await axiosInstance.get(`/community/posts/${postId}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Update post
export const updatePost = async (postId, formData) => {
  try {
    const res = await axiosInstance.put(`/community/posts/${postId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Delete post
export const deletePost = async (postId) => {
  try {
    const res = await axiosInstance.delete(`/community/posts/${postId}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Toggle reaction
export const toggleReaction = async (postId) => {
  try {
    const res = await axiosInstance.post(`/community/posts/${postId}/react`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Add comment
export const addComment = async (postId, text) => {
  try {
    const res = await axiosInstance.post(`/community/posts/${postId}/comment`, { text });
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Delete comment
export const deleteComment = async (postId, commentId) => {
  try {
    const res = await axiosInstance.delete(`/community/posts/${postId}/comment/${commentId}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};