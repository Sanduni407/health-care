import { useState, useEffect, useContext } from "react";
import { MessageCircle, Send, Trash2, UserCircle, Stethoscope, Activity, Heart as HeartPulse, TrendingUp } from "lucide-react";
import { getAllPosts, toggleReaction, addComment, deleteComment } from "../../api/communityApi";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar/Navbar";

export default function CommunityFeed() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await getAllPosts();
      console.log("Posts response:", res);
      if (res.success) {
        setPosts(res.posts);
      } else {
        console.error("Failed to fetch posts:", res.message);
        alert("Failed to load posts: " + res.message);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      alert("Error loading posts");
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (postId) => {
    try {
      const res = await toggleReaction(postId);
      if (res.success) {
        setPosts(posts.map(p => p._id === postId ? res.post : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await addComment(postId, commentText);
      if (res.success) {
        setPosts(posts.map(p => p._id === postId ? res.post : p));
        setCommentText("");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      const res = await deleteComment(postId, commentId);
      if (res.success) {
        setPosts(posts.map(p => p._id === postId ? res.post : p));
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting comment");
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      lifestyle: "bg-blue-100 text-blue-700 border-blue-300",
      disease: "bg-red-100 text-red-700 border-red-300",
      prevention: "bg-green-100 text-green-700 border-green-300",
      treatment: "bg-purple-100 text-purple-700 border-purple-300"
    };
    return colors[category] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return postDate.toLocaleDateString();
  };

  const isReactedByUser = (post) => {
    if (!user?.id || !post.reactions) return false;
    return post.reactions.some(r => {
      const reactionUserId = r.user?._id || r.user;
      return reactionUserId === user.id;
    });
  };

  const isCommentByCurrentUser = (comment) => {
    if (!user?.id) return false;
    const commentUserId = comment.user?._id || comment.user;
    return commentUserId === user.id;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Enhanced Header with Medical Icons */}
        <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 rounded-2xl shadow-xl p-8 mb-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4">
              <Stethoscope className="w-20 h-20 text-white transform -rotate-12" />
            </div>
            <div className="absolute bottom-4 right-4">
              <Activity className="w-24 h-24 text-white transform rotate-12" />
            </div>
            <div className="absolute top-1/2 left-1/3">
              <HeartPulse className="w-16 h-16 text-white animate-pulse" />
            </div>
          </div>

          {/* Header Content */}
          <div className="relative z-10 text-center">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-3">
              Our Community
            </h1>
            
            <p className="text-white text-lg font-medium drop-shadow-md mb-6">
              Expert Health Insights & Medical Knowledge Shared by Professionals
            </p>

            {/* Stats/Features Bar with Dark Navy Blue Background */}
            <div className="flex items-center justify-center space-x-8 mt-6">
              <div className="flex items-center space-x-2 bg-[#001f3f] px-4 py-2 rounded-full shadow-md">
                <Stethoscope className="w-5 h-5 text-white" />
                <span className="text-white font-semibold text-sm">Expert Advice</span>
              </div>
              <div className="flex items-center space-x-2 bg-[#001f3f] px-4 py-2 rounded-full shadow-md">
                <Activity className="w-5 h-5 text-white" />
                <span className="text-white font-semibold text-sm">Health Tips</span>
              </div>
              <div className="flex items-center space-x-2 bg-[#001f3f] px-4 py-2 rounded-full shadow-md">
                <TrendingUp className="w-5 h-5 text-white" />
                <span className="text-white font-semibold text-sm">Latest Updates</span>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-1 left-0 right-0 h-2 bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400"></div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No posts yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Post Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 ring-2 ring-teal-200">
                      {post.doctor?.image ? (
                        <img
                          src={`http://localhost:4000${post.doctor.image}`}
                          alt={post.doctor.name || "Doctor"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log("Image failed to load:", post.doctor.image);
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<svg class="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>';
                          }}
                        />
                      ) : (
                        <UserCircle className="w-8 h-8 text-teal-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {post.doctor?.name || "Unknown Doctor"}
                      </p>
                      <p className="text-sm text-gray-500">{getTimeAgo(post.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">{post.caption}</h2>
                  <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.description}</p>

                  {post.image && (
                    <img
                      src={`http://localhost:4000${post.image}`}
                      alt="Post"
                      className="w-full rounded-lg mb-4 max-h-96 object-cover"
                      onError={(e) => {
                        console.log("Post image failed to load:", post.image);
                        e.target.style.display = 'none';
                      }}
                    />
                  )}

                  {post.categories && post.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.categories.map((category, index) => (
                        <span
                          key={`${category}-${index}`}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(category)}`}
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Actions */}
                <div className="px-6 pb-4 flex items-center justify-between border-t border-gray-100 pt-4">
                  <button
                    onClick={() => handleReaction(post._id)}
                    className="flex items-center space-x-2 group transition-all hover:scale-105"
                  >
                    <svg
                      className={`w-6 h-6 transition-all ${
                        isReactedByUser(post)
                          ? "fill-red-500 stroke-red-500 animate-pulse"
                          : "fill-none stroke-gray-400 group-hover:stroke-red-400 group-hover:scale-110"
                      }`}
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span className={`text-sm font-medium ${
                      isReactedByUser(post) ? "text-red-500" : "text-gray-600"
                    }`}>
                      {post.reactions?.length || 0}
                    </span>
                  </button>

                  <button
                    onClick={() => setShowComments(showComments === post._id ? null : post._id)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-all hover:scale-105"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span className="text-sm font-medium">{post.comments?.length || 0}</span>
                  </button>
                </div>

                {/* Comments Section */}
                {showComments === post._id && (
                  <div className="border-t border-gray-100 p-6 bg-gray-50">
                    <h3 className="font-semibold text-gray-800 mb-4">Comments</h3>

                    {/* Comment List */}
                    <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                      {!post.comments || post.comments.length === 0 ? (
                        <p className="text-gray-500 text-sm">No comments yet</p>
                      ) : (
                        post.comments.map((comment) => (
                          <div key={comment._id} className="bg-white rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800 text-sm">
                                  {comment.user?.name || "Unknown User"}
                                </p>
                                <p className="text-gray-700 mt-1">{comment.text}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {getTimeAgo(comment.createdAt)}
                                </p>
                              </div>
                              {isCommentByCurrentUser(comment) && (
                                <button
                                  onClick={() => handleDeleteComment(post._id, comment._id)}
                                  className="text-red-500 hover:text-red-700 ml-2 transition-colors"
                                  title="Delete comment"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Comment */}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !submittingComment) {
                            handleAddComment(post._id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        disabled={!commentText.trim() || submittingComment}
                        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                      >
                        {submittingComment ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}