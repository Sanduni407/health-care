import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, CheckCircle2 } from "lucide-react";
import { createPost } from "../../api/communityApi";
import Navbar from "../../components/Navbar/Navbar";

export default function CreatePost() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    caption: "",
    description: "",
    categories: []
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  const categories = ["lifestyle", "disease", "prevention", "treatment"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryToggle = (category) => {
    if (form.categories.includes(category)) {
      setForm({ ...form, categories: form.categories.filter(c => c !== category) });
    } else {
      setForm({ ...form, categories: [...form.categories, category] });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.caption.trim() || !form.description.trim()) {
      setError("Caption and description are required");
      return;
    }

    if (form.categories.length === 0) {
      setError("Please select at least one category");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("caption", form.caption);
      formData.append("description", form.description);
      formData.append("categories", JSON.stringify(form.categories));
      if (image) formData.append("image", image);

      const res = await createPost(formData);

      if (res.success) {
        setSubmitted(true);
        setTimeout(() => {
          navigate("/community");
        }, 2000);
      } else {
        setError(res.message || "Failed to create post");
      }
    } catch (err) {
      setError("Error creating post. Please try again.");
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-8">
        {submitted ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Post Created Successfully!</h2>
            <p className="text-gray-600 mb-4">Redirecting to community feed...</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Create Community Post</h1>
              <p className="text-gray-600 mt-2">Share health insights with the community</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="caption"
                  value={form.caption}
                  onChange={handleChange}
                  placeholder="Enter a catchy caption for your post"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Write your post description here..."
                  required
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Categories <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className={`cursor-pointer px-4 py-2 rounded-full border-2 transition-all ${
                        form.categories.includes(category)
                          ? getCategoryColor(category) + " font-semibold"
                          : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.categories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="hidden"
                      />
                      <span className="capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image (Optional)
                </label>
                <div className="space-y-4">
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-md flex items-center justify-center space-x-2 transition-colors border-2 border-dashed border-gray-300">
                    <Upload className="w-5 h-5" />
                    <span>Choose Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-all shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Posting..." : "Post"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/doctor-profile")}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}