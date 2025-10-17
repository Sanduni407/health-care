import { X, Download } from "lucide-react";

export default function ReportViewer({ filePath, onClose }) {
  if (!filePath) return null;

  const fullPath = `http://localhost:4000${filePath}`;

  console.log("Viewing report at:", fullPath);

  const isPDF = filePath.toLowerCase().endsWith('.pdf');
  const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(filePath);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fullPath;
    link.download = filePath.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">View Report</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Download Report"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Close"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {isPDF ? (
            <iframe
              src={fullPath}
              className="w-full h-full border border-gray-300 rounded"
              title="PDF Report"
            />
          ) : isImage ? (
            <div className="flex items-center justify-center h-full">
              <img
                src={fullPath}
                alt="Health Report"
                className="max-w-full max-h-full object-contain rounded shadow-lg"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Unable to preview this file type
                </p>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors flex items-center gap-2 mx-auto"
                >
                  <Download className="w-4 h-4" />
                  Download File
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}