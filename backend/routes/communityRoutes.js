import express from "express";
import {
  createPost,
  getAllPosts,
  getDoctorPosts,
  getPostDetails,
  updatePost,
  deletePost,
  toggleReaction,
  addComment,
  deleteComment
} from "../controllers/communityController.js";
import { userAuth } from "../middlewares/authMiddleware.js";
import { roleAuth } from "../middlewares/roleMiddleware.js";
import uploadCommunity from "../utils/communityMulter.js";

const router = express.Router();

// Get all posts (community feed) - accessible by all logged-in users
router.get("/posts", userAuth, getAllPosts);

// Get single post
router.get("/posts/:id", userAuth, getPostDetails);

// Doctor-only routes
router.post("/posts", userAuth, roleAuth(["doctor"]), uploadCommunity.single("image"), createPost);
router.get("/my-posts", userAuth, roleAuth(["doctor"]), getDoctorPosts);
router.put("/posts/:id", userAuth, roleAuth(["doctor"]), uploadCommunity.single("image"), updatePost);
router.delete("/posts/:id", userAuth, roleAuth(["doctor"]), deletePost);

// Reactions and comments - accessible by all logged-in users
router.post("/posts/:id/react", userAuth, toggleReaction);
router.post("/posts/:id/comment", userAuth, addComment);
router.delete("/posts/:postId/comment/:commentId", userAuth, deleteComment);

export default router;