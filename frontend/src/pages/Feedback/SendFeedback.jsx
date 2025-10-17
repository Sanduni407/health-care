import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Upload, Star, AlertCircle, MessageCircle, Flag } from "lucide-react";
import { getAllDoctors, createFeedback } from "../../api/feedbackApi";
import Navbar from "../../components/Navbar/Navbar";

export default function SendFeedback() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    doctor: "",
    title: "",
    note: "",
    tag: "",
    rating: ""
  });
  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await getAllDoctors();
      if (res.success) {
        setDoctors(res.doctors);
      } else {
        setError("Failed to load doctors");
      }
    } catch (err) {
      setError("Error loading doctors");
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Reset rating when tag changes
    if (name === "tag" && value !== "remark") {
      setForm(prev => ({ ...prev, rating: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      setError("Image size should be less than 2MB");
      return;
    }
    setAttachment(file);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.doctor || !form.title || !form.note || !form.tag) {
      setError("Please fill all required fields");
      return;
    }

    if (form.tag === "remark" && !form.rating) {
      setError("Please provide a rating for remark feedback");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("doctor", form.doctor);
      formData.append("title", form.title);
      formData.append("note", form.note);
      formData.append("tag", form.tag);
      if (form.rating) formData.append("rating", form.rating);
      if (attachment) formData.append("attachment", attachment);

      const res = await createFeedback(formData);
      
      if (res.success) {
        setSubmitted(true);
        // Reset form
        setForm({
          doctor: "",
          title: "",
          note: "",
          tag: "",
          rating: ""
        });
        setAttachment(null);
      } else {
        setError(res.message || "Failed to send feedback");
      }
    } catch (err) {
      setError("Error sending feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const handleNewFeedback = () => {
    setSubmitted(false);
    setForm({
      doctor: "",
      title: "",
      note: "",
      tag: "",
      rating: ""
    });
    setAttachment(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {submitted ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Feedback Sent Successfully!</h2>
              <p className="text-gray-600 mb-6">Your feedback has been sent to the doctor.</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleNewFeedback}
                  className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700"
                >
                  Send Another Feedback
                </button>
                <button
                  onClick={() => navigate("/patient-profile")}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300"
                >
                  Back to Profile
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-teal-600 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">Send Feedback</h1>
                    <p className="text-gray-600 mt-1">Share your experience with your doctor</p>
                  </div>
                </div>
              </div>

              {loadingDoctors ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-600">Loading doctors...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="text"
                      value={getCurrentDate()}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Doctor <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="doctor"
                      value={form.doctor}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Select a doctor</option>
                      {doctors.map((doc) => (
                        <option key={doc._id} value={doc._id}>
                          {doc.name}
                        </option>
                      ))}
                    </select>
                    {doctors.length === 0 && (
                      <p className="text-sm text-gray-500 mt-1">No doctors available</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      placeholder="Brief title for your feedback"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Note <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="note"
                      value={form.note}
                      onChange={handleChange}
                      required
                      rows="4"
                      placeholder="Describe your feedback in detail"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attachment (Optional)
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-md flex items-center space-x-2 transition-colors">
                        <Upload className="w-5 h-5" />
                        <span>Choose Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      {attachment && (
                        <span className="text-sm text-teal-600">{attachment.name}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Max size: 2MB</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Tag <span className="text-red-500">*</span>
                    </label>
                    
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                      <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-md hover:bg-white transition-colors">
                        <input
                          type="radio"
                          name="tag"
                          value="urgent"
                          checked={form.tag === "urgent"}
                          onChange={handleChange}
                          required
                          className="mt-1 w-4 h-4 text-teal-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <span className="font-semibold text-gray-800">Urgent</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Choose urgent if you expect a direct reply
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-md hover:bg-white transition-colors">
                        <input
                          type="radio"
                          name="tag"
                          value="remark"
                          checked={form.tag === "remark"}
                          onChange={handleChange}
                          required
                          className="mt-1 w-4 h-4 text-teal-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <MessageCircle className="w-5 h-5 text-blue-500" />
                            <span className="font-semibold text-gray-800">Remark</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Choose remark if you want to give a regular feedback
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-md hover:bg-white transition-colors">
                        <input
                          type="radio"
                          name="tag"
                          value="concern"
                          checked={form.tag === "concern"}
                          onChange={handleChange}
                          required
                          className="mt-1 w-4 h-4 text-teal-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Flag className="w-5 h-5 text-orange-500" />
                            <span className="font-semibold text-gray-800">Concern</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Choose concern if you consider this as a special request
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {form.tag === "remark" && (
                    <div className="animate-fadeIn">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Rating <span className="text-red-500">*</span>
                      </label>
                      <div className="flex space-x-4">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <label
                            key={num}
                            className="cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="rating"
                              value={num}
                              checked={form.rating === String(num)}
                              onChange={handleChange}
                              className="hidden"
                              required={form.tag === "remark"}
                            />
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                                form.rating === String(num)
                                  ? "bg-teal-600 text-white scale-110"
                                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                              }`}
                            >
                              {num}
                            </div>
                          </label>
                        ))}
                      </div>
                      <div className="flex items-center space-x-1 mt-3">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <Star
                            key={num}
                            className={`w-6 h-6 ${
                              form.rating && num <= parseInt(form.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-all shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      "Submit Feedback"
                    )}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}