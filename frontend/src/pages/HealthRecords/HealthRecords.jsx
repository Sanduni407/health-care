import { useState, useEffect } from "react";
import { Plus, Trash2, Eye, Filter } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import UploadRecord from "./UploadRecord";
import AnalyzeReports from "./AnalyzeReports";
import ReportViewer from "../../components/ReportViewer/ReportViewer";
import { getHealthRecords, deleteHealthRecord } from "../../api/healthRecordApi";

const recordTypeColors = {
  blood: "bg-red-100 text-red-800",
  pressure: "bg-blue-100 text-blue-800",
  sugar: "bg-orange-100 text-orange-800",
  cholesterol: "bg-yellow-100 text-yellow-800",
  liver: "bg-green-100 text-green-800",
  kidney: "bg-purple-100 text-purple-800",
  thyroid: "bg-pink-100 text-pink-800",
};

export default function HealthRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [activeTab, setActiveTab] = useState("records");

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async (type = null) => {
    setLoading(true);
    const res = await getHealthRecords(type);
    if (res.success) {
      setRecords(res.records);
    }
    setLoading(false);
  };

  const handleFilterChange = (type) => {
    setSelectedFilter(type === selectedFilter ? null : type);
    fetchRecords(type === selectedFilter ? null : type);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    const res = await deleteHealthRecord(id);
    if (res.success) {
      fetchRecords(selectedFilter);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const recordTypes = [
    "blood",
    "pressure",
    "sugar",
    "cholesterol",
    "liver",
    "kidney",
    "thyroid",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-teal-600 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-white">Health Records</h1>
          <p className="text-white opacity-90 mt-2">Manage and analyze your medical records</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("records")}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === "records"
                ? "text-teal-600 border-b-2 border-teal-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            My Records
          </button>
          <button
            onClick={() => setActiveTab("analyze")}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === "analyze"
                ? "text-teal-600 border-b-2 border-teal-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Analyze Reports
          </button>
        </div>

        {/* Records Tab */}
        {activeTab === "records" && (
          <div className="space-y-6">
            {/* Upload Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium shadow-md"
              >
                <Plus className="w-5 h-5" />
                Upload New Record
              </button>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">Filter by Type</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {recordTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFilterChange(type)}
                    className={`px-4 py-2 rounded-full font-medium transition-colors ${
                      selectedFilter === type
                        ? `${recordTypeColors[type]} ring-2 ring-offset-2 ring-teal-600`
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Records List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : records.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-600 mb-4">No health records found</p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Upload your first record
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {records.map((record) => (
                    <div
                      key={record._id}
                      className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              recordTypeColors[record.recordType]
                            }`}
                          >
                            {record.recordType.charAt(0).toUpperCase() +
                              record.recordType.slice(1)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(record.uploadDate)}
                          </span>
                        </div>
                        <p className="font-medium text-gray-800 mb-1">
                          {record.fileName}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{formatFileSize(record.fileSize)}</span>
                          {record.notes && <span>{record.notes}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => setViewingReport(record.filePath)}
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded transition-colors"
                          title="View Report"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(record._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analyze Tab */}
        {activeTab === "analyze" && <AnalyzeReports />}
      </div>

      {/* Modals */}
      {showUploadModal && (
        <UploadRecord
          onSuccess={() => fetchRecords(selectedFilter)}
          onClose={() => setShowUploadModal(false)}
        />
      )}

      {viewingReport && (
        <ReportViewer
          filePath={viewingReport}
          onClose={() => setViewingReport(null)}
        />
      )}
    </div>
  );
}