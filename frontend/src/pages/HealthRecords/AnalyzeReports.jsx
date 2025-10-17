import { useState } from "react";
import { Zap, Download } from "lucide-react";
import { analyzeSingleReport } from "../../api/healthRecordApi";
import jsPDF from "jspdf";

export default function AnalyzeSingleReport() {
  const [report, setReport] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!report.trim()) {
      setError("Please paste your blood report");
      return;
    }

    setError(null);
    setLoading(true);

    const res = await analyzeSingleReport(report);
    setLoading(false);

    if (res.success) {
      setAnalysis(res.analysis);
    } else {
      setError(res.message);
    }
  };

  const downloadAnalysisAsPDF = () => {
    if (!analysis) return;

    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const maxWidth = pageWidth - 2 * margin;

    // Title
    doc.setFontSize(16);
    doc.text("Blood Report Analysis", margin, margin + 10);

    // Date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, margin + 20);

    // Analysis text
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(analysis, maxWidth);
    doc.text(lines, margin, margin + 30);

    // Save
    doc.save("blood-report-analysis.pdf");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6 text-teal-600" />
          Analyze Blood Report(s)
        </h3>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blood Report (Text)
          </label>
          <textarea
            value={report}
            onChange={(e) => setReport(e.target.value)}
            placeholder="Copy and paste your blood report here..."
            rows="10"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-teal-500 font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-2">
            Paste the text content from your blood report
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full px-6 py-3 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 font-medium"
        >
          <Zap className="w-5 h-5" />
          {loading ? "Analyzing..." : "Analyze Report"}
        </button>
      </div>

      {analysis && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-teal-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Analysis Result</h3>
            <button
              onClick={downloadAnalysisAsPDF}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
          <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded whitespace-pre-wrap text-gray-700 leading-relaxed">
            {analysis}
          </div>
        </div>
      )}
    </div>
  );
}