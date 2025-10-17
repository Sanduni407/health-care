import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Heart, MessageCircle, FileText } from "lucide-react";
import { getDoctorPosts, deletePost } from "../../api/communityApi";
import Navbar from "../../components/Navbar/Navbar";

export default function MyPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await getDoctorPosts();
      if (res.success) {
        setPosts(res.posts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await deletePost(postId);
      if (res.success) {
        setPosts(posts.filter(p => p._id !== postId));
        alert("Post deleted successfully");
      } else {
        alert(res.message || "Failed to delete post");
      }
    } catch (err) {
      alert("Error deleting post");
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "lifestyle":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "disease":
        return "bg-red-100 text-red-700 border-red-300";
      case "prevention":
        return "bg-green-100 text-green-700 border-green-300";
      case "treatment":
        return "bg-purple-100 text-purple-700 border-purple-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Posts</h1>
              <p className="text-gray-600 mt-2">Manage your community posts</p>
            </div>
            <button
              onClick={() => navigate("/create-post")}
              className="bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700 font-semibold transition-all"
            >
              Create New Post
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">You haven't created any posts yet</p>
            <button
              onClick={() => navigate("/create-post")}
              className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700"
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Post Header with Actions */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">{getTimeAgo(post.createdAt)}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/edit-post/${post._id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
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
                      className="w-full rounded-lg mb-4"
                    />
                  )}

                  <div className="flex flex-wrap gap-2">
                    {post.categories?.map((category) => (
                      <span
                        key={category}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(category)}`}
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Post Stats */}
                <div className="px-6 pb-4 flex items-center space-x-6 border-t border-gray-100 pt-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.reactions?.length || 0} reactions</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.comments?.length || 0} comments</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}