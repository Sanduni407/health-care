import { useState, useEffect } from "react";
import { Bell, X, MessageSquare } from "lucide-react";
import { getPatientUrgentResponses, getUrgentResponseDetails } from "../../api/feedbackApi";
import Navbar from "../../components/Navbar/Navbar";

export default function UrgentResponses() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const res = await getPatientUrgentResponses();
      if (res.success) {
        setResponses(res.responses);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResponseClick = async (responseId) => {
    try {
      const res = await getUrgentResponseDetails(responseId);
      if (res.success) {
        setSelectedResponse(res.response);
        setShowDetailsModal(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-red-600 rounded-lg flex items-center justify-center">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Urgent Responses</h1>
              <p className="text-gray-600 mt-1">Replies from doctors to your urgent feedback</p>
            </div>
          </div>
        </div>

        {/* Responses List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading responses...</p>
          </div>
        ) : responses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No urgent responses yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {responses.map((response) => (
              <div
                key={response._id}
                onClick={() => handleResponseClick(response._id)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all cursor-pointer border border-gray-100 hover:border-red-500"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-800 flex-1 pr-2">
                    {response.feedbackTitle}
                  </h3>
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{formatDate(response.date)}</p>
                
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">From:</span> {response.doctor?.name}
                  </p>
                </div>

                <div className="mt-3 flex items-center text-teal-600 text-sm font-medium">
                  <span>Click to view reply</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Response Details Modal */}
        {showDetailsModal && selectedResponse && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowDetailsModal(false)}></div>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Doctor's Reply</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Bell className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-red-800">Urgent Response</span>
                    </div>
                    <p className="text-sm text-red-700">
                      This is a reply to your urgent feedback
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Related Feedback</label>
                    <p className="text-gray-800 mt-1 font-semibold">{selectedResponse.feedbackTitle}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Doctor</label>
                    <p className="text-gray-800 mt-1">{selectedResponse.doctor?.name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Date</label>
                    <p className="text-gray-800 mt-1">{formatDate(selectedResponse.date)}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Reply</label>
                    <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-800 whitespace-pre-wrap">{selectedResponse.reply}</p>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="border-t border-gray-200 p-6 flex justify-end">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                  >
                    Close
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