import { useState, useEffect } from "react";
import { Star, Filter, X, MessageSquare, Send, Check, Flag as FlagIcon, AlertCircle, MessageCircle } from "lucide-react";
import { getDoctorFeedbacks, getFeedbackDetails, sendUrgentResponse, flagConcern, markRemarkReviewed } from "../../api/feedbackApi";
import Navbar from "../../components/Navbar/Navbar";

export default function DoctorFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [reviewedFeedbacks, setReviewedFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTag, setFilterTag] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUrgentReplyForm, setShowUrgentReplyForm] = useState(false);
  const [showConcernForm, setShowConcernForm] = useState(false);
  const [urgentReply, setUrgentReply] = useState("");
  const [concernText, setConcernText] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchFeedbacks();
  }, [filterTag, activeTab]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const status = activeTab === "pending" ? "pending" : "reviewed";
      const res = await getDoctorFeedbacks(status, filterTag);
      if (res.success) {
        if (activeTab === "pending") {
          setFeedbacks(res.feedbacks);
        } else {
          setReviewedFeedbacks(res.feedbacks);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackClick = async (feedbackId) => {
    try {
      const res = await getFeedbackDetails(feedbackId);
      if (res.success) {
        setSelectedFeedback(res.feedback);
        setShowDetailsModal(true);
        setConcernText(res.feedback.note);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUrgentReply = async () => {
    if (!urgentReply.trim()) return;
    
    setActionLoading(true);
    try {
      const res = await sendUrgentResponse(selectedFeedback._id, urgentReply);
      if (res.success) {
        alert("Reply sent successfully!");
        setShowUrgentReplyForm(false);
        setShowDetailsModal(false);
        setUrgentReply("");
        fetchFeedbacks();
      } else {
        alert(res.message || "Failed to send reply");
      }
    } catch (err) {
      alert("Error sending reply");
    } finally {
      setActionLoading(false);
    }
  };

  const handleFlagConcern = async () => {
    if (!concernText.trim()) return;
    
    setActionLoading(true);
    try {
      const res = await flagConcern(selectedFeedback._id, concernText);
      if (res.success) {
        alert("Concern flagged successfully!");
        setShowConcernForm(false);
        setShowDetailsModal(false);
        setConcernText("");
        fetchFeedbacks();
      } else {
        alert(res.message || "Failed to flag concern");
      }
    } catch (err) {
      alert("Error flagging concern");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkReviewed = async (feedbackId) => {
    setActionLoading(true);
    try {
      const res = await markRemarkReviewed(feedbackId);
      if (res.success) {
        setShowDetailsModal(false);
        fetchFeedbacks();
      } else {
        alert(res.message || "Failed to mark as reviewed");
      }
    } catch (err) {
      alert("Error marking as reviewed");
    } finally {
      setActionLoading(false);
    }
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((num) => (
          <Star
            key={num}
            className={`w-4 h-4 ${
              num <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getTagColor = (tag) => {
    switch (tag) {
      case "urgent":
        return "bg-red-100 text-red-700 border-red-300";
      case "remark":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "concern":
        return "bg-orange-100 text-orange-700 border-orange-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getTagIcon = (tag) => {
    switch (tag) {
      case "urgent":
        return <AlertCircle className="w-4 h-4" />;
      case "remark":
        return <MessageCircle className="w-4 h-4" />;
      case "concern":
        return <FlagIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const displayFeedbacks = activeTab === "pending" ? feedbacks : reviewedFeedbacks;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-teal-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Patient Feedbacks</h1>
                <p className="text-gray-600 mt-1">View and manage patient feedback</p>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                <Filter className="w-5 h-5" />
                <span>Filter</span>
                {filterTag && <span className="ml-2 bg-white text-teal-600 px-2 py-0.5 rounded-full text-xs font-semibold">{filterTag}</span>}
              </button>

              {showFilterMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowFilterMenu(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2">
                    <button
                      onClick={() => { setFilterTag(null); setShowFilterMenu(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                    >
                      All Feedbacks
                    </button>
                    <button
                      onClick={() => { setFilterTag("urgent"); setShowFilterMenu(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 flex items-center space-x-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>Urgent</span>
                    </button>
                    <button
                      onClick={() => { setFilterTag("remark"); setShowFilterMenu(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-blue-600 flex items-center space-x-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Remark</span>
                    </button>
                    <button
                      onClick={() => { setFilterTag("concern"); setShowFilterMenu(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-orange-600 flex items-center space-x-2"
                    >
                      <FlagIcon className="w-4 h-4" />
                      <span>Concern</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex space-x-4 mt-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("pending")}
              className={`pb-3 px-4 font-medium transition-colors ${
                activeTab === "pending"
                  ? "text-teal-600 border-b-2 border-teal-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Pending ({feedbacks.length})
            </button>
            <button
              onClick={() => setActiveTab("reviewed")}
              className={`pb-3 px-4 font-medium transition-colors ${
                activeTab === "reviewed"
                  ? "text-teal-600 border-b-2 border-teal-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Reviewed ({reviewedFeedbacks.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading feedbacks...</p>
          </div>
        ) : displayFeedbacks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No feedbacks found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayFeedbacks.map((feedback) => (
              <div
                key={feedback._id}
                onClick={() => handleFeedbackClick(feedback._id)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all cursor-pointer border border-gray-100 hover:border-teal-500"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-800 flex-1 pr-2">{feedback.title}</h3>
                  {activeTab === "reviewed" && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Reviewed</span>
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{formatDate(feedback.date)}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs px-3 py-1 rounded-full border font-semibold flex items-center space-x-1 ${getTagColor(feedback.tag)}`}>
                    {getTagIcon(feedback.tag)}
                    <span className="capitalize">{feedback.tag}</span>
                  </span>
                </div>

                {feedback.rating && (
                  <div className="mt-3">
                    {renderStars(feedback.rating)}
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Patient:</span> {feedback.patient?.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {showDetailsModal && selectedFeedback && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowDetailsModal(false)}></div>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Feedback Details</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date</label>
                    <p className="text-gray-800 mt-1">{formatDate(selectedFeedback.date)}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Patient</label>
                    <p className="text-gray-800 mt-1">{selectedFeedback.patient?.name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Title</label>
                    <p className="text-gray-800 mt-1 font-semibold">{selectedFeedback.title}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Note</label>
                    <p className="text-gray-800 mt-1 whitespace-pre-wrap">{selectedFeedback.note}</p>
                  </div>

                  {selectedFeedback.attachment && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Attachment</label>
                      <img
                        src={`http://localhost:4000${selectedFeedback.attachment}`}
                        alt="Feedback attachment"
                        className="mt-2 rounded-lg max-w-full h-auto border border-gray-200"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-600">Tag</label>
                    <div className="mt-2">
                      <span className={`text-sm px-3 py-1 rounded-full border font-semibold inline-flex items-center space-x-1 ${getTagColor(selectedFeedback.tag)}`}>
                        {getTagIcon(selectedFeedback.tag)}
                        <span className="capitalize">{selectedFeedback.tag}</span>
                      </span>
                    </div>
                  </div>

                  {selectedFeedback.rating && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Rating</label>
                      <div className="mt-2">
                        {renderStars(selectedFeedback.rating)}
                      </div>
                    </div>
                  )}
                </div>

                {selectedFeedback.status === "pending" && (
                  <div className="border-t border-gray-200 p-6 flex justify-end space-x-3">
                    {selectedFeedback.tag === "urgent" && (
                      <button
                        onClick={() => setShowUrgentReplyForm(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        <MessageSquare className="w-5 h-5" />
                        <span>Reply</span>
                      </button>
                    )}

                    {selectedFeedback.tag === "concern" && (
                      <button
                        onClick={() => setShowConcernForm(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                      >
                        <FlagIcon className="w-5 h-5" />
                        <span>Flag Concern</span>
                      </button>
                    )}

                    {selectedFeedback.tag === "remark" && (
                      <button
                        onClick={() => handleMarkReviewed(selectedFeedback._id)}
                        disabled={actionLoading}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                      >
                        <Check className="w-5 h-5" />
                        <span>{actionLoading ? "Processing..." : "Mark Reviewed"}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {showUrgentReplyForm && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowUrgentReplyForm(false)}></div>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
                <div className="border-b border-gray-200 p-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Send Urgent Reply</h2>
                  <button
                    onClick={() => setShowUrgentReplyForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="text"
                      value={getCurrentDate()}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reply <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={urgentReply}
                      onChange={(e) => setUrgentReply(e.target.value)}
                      rows="4"
                      placeholder="Type your reply here..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 p-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowUrgentReplyForm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUrgentReply}
                    disabled={!urgentReply.trim() || actionLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400"
                  >
                    <Send className="w-5 h-5" />
                    <span>{actionLoading ? "Sending..." : "Send"}</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {showConcernForm && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowConcernForm(false)}></div>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
                <div className="border-b border-gray-200 p-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Flag Concern</h2>
                  <button
                    onClick={() => setShowConcernForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="text"
                      value={getCurrentDate()}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Concern <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={concernText}
                      onChange={(e) => setConcernText(e.target.value)}
                      rows="4"
                      placeholder="Edit or add details about this concern..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">You can edit the patient's note above</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 p-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowConcernForm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFlagConcern}
                    disabled={!concernText.trim() || actionLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400"
                  >
                    <Send className="w-5 h-5" />
                    <span>{actionLoading ? "Sending..." : "Send"}</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}