import { useState, useEffect } from "react";
import { Calendar, Clock, Plus, Trash2, AlertCircle } from "lucide-react";
import {
  getWeeklyTemplates,
  createWeeklyTemplate,
  deleteWeeklyTemplate,
  getOneOffAvailabilities,
  createOneOffAvailability,
  deleteOneOffAvailability,
} from "../../api/availabilityApi";
import Navbar from "../../components/Navbar/Navbar";

export default function DoctorAvailability() {
  const [weeklyTemplates, setWeeklyTemplates] = useState([]);
  const [oneOffAvailabilities, setOneOffAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWeeklyForm, setShowWeeklyForm] = useState(false);
  const [showOneOffForm, setShowOneOffForm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [weeklyForm, setWeeklyForm] = useState({
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "17:00",
  });

  const [oneOffForm, setOneOffForm] = useState({
    date: "",
    startTime: "09:00",
    endTime: "17:00",
    type: "available",
  });

  const daysOfWeek = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [templatesRes, oneOffsRes] = await Promise.all([
        getWeeklyTemplates(),
        getOneOffAvailabilities(),
      ]);

      if (templatesRes.success) setWeeklyTemplates(templatesRes.templates);
      if (oneOffsRes.success) setOneOffAvailabilities(oneOffsRes.oneOffs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWeeklyTemplate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const res = await createWeeklyTemplate(weeklyForm);
    if (res.success) {
      setSuccess("Weekly template created successfully! Slots are being generated.");
      setShowWeeklyForm(false);
      setWeeklyForm({ dayOfWeek: 1, startTime: "09:00", endTime: "17:00" });
      fetchData();
    } else {
      setError(res.message);
    }
  };

  const handleDeleteWeeklyTemplate = async (id) => {
    if (!window.confirm("Are you sure? This will regenerate all slots.")) return;

    const res = await deleteWeeklyTemplate(id);
    if (res.success) {
      setSuccess("Template deleted successfully!");
      fetchData();
    } else {
      setError(res.message);
    }
  };

  const handleCreateOneOff = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const res = await createOneOffAvailability(oneOffForm);
    if (res.success) {
      if (oneOffForm.type === "unavailable" && res.message) {
        setSuccess(res.message);
      } else {
        setSuccess("One-off availability created successfully!");
      }
      setShowOneOffForm(false);
      setOneOffForm({ date: "", startTime: "09:00", endTime: "17:00", type: "available" });
      fetchData();
    } else {
      setError(res.message);
    }
  };

  const handleDeleteOneOff = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    const res = await deleteOneOffAvailability(id);
    if (res.success) {
      setSuccess("One-off availability deleted!");
      fetchData();
    } else {
      setError(res.message);
    }
  };

  const getDayName = (dayNum) => {
    return daysOfWeek.find((d) => d.value === dayNum)?.label || "Unknown";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Manage Availability
          </h1>
          <p className="text-gray-600">
            Set your weekly schedule and special availability dates
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Templates Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-6 h-6 text-teal-600" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Weekly Schedule
                </h2>
              </div>
              <button
                onClick={() => setShowWeeklyForm(!showWeeklyForm)}
                className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {/* Weekly Form */}
            {showWeeklyForm && (
              <form onSubmit={handleCreateWeeklyTemplate} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Day of Week
                    </label>
                    <select
                      value={weeklyForm.dayOfWeek}
                      onChange={(e) =>
                        setWeeklyForm({
                          ...weeklyForm,
                          dayOfWeek: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                    >
                      {daysOfWeek.map((day) => (
                        <option key={day.value} value={day.value}>
                          {day.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={weeklyForm.startTime}
                        onChange={(e) =>
                          setWeeklyForm({ ...weeklyForm, startTime: e.target.value })
                        }
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={weeklyForm.endTime}
                        onChange={(e) =>
                          setWeeklyForm({ ...weeklyForm, endTime: e.target.value })
                        }
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                    >
                      Create Template
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowWeeklyForm(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Weekly Templates List */}
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : weeklyTemplates.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No weekly templates set
              </p>
            ) : (
              <div className="space-y-3">
                {weeklyTemplates.map((template) => (
                  <div
                    key={template._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {getDayName(template.dayOfWeek)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {template.startTime} - {template.endTime}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteWeeklyTemplate(template._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* One-Off Availability Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-teal-600" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Special Dates
                </h2>
              </div>
              <button
                onClick={() => setShowOneOffForm(!showOneOffForm)}
                className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {/* One-Off Form */}
            {showOneOffForm && (
              <form onSubmit={handleCreateOneOff} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={oneOffForm.date}
                      onChange={(e) =>
                        setOneOffForm({ ...oneOffForm, date: e.target.value })
                      }
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={oneOffForm.type}
                      onChange={(e) =>
                        setOneOffForm({ ...oneOffForm, type: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>

                  {oneOffForm.type === "available" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={oneOffForm.startTime}
                          onChange={(e) =>
                            setOneOffForm({
                              ...oneOffForm,
                              startTime: e.target.value,
                            })
                          }
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={oneOffForm.endTime}
                          onChange={(e) =>
                            setOneOffForm({
                              ...oneOffForm,
                              endTime: e.target.value,
                            })
                          }
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  )}

                  {oneOffForm.type === "unavailable" && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-800">
                        ⚠️ This will cancel all booked appointments on this date and notify patients.
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowOneOffForm(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* One-Off List */}
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : oneOffAvailabilities.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No special dates set
              </p>
            ) : (
              <div className="space-y-3">
                {oneOffAvailabilities.map((oneOff) => (
                  <div
                    key={oneOff._id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      oneOff.type === "unavailable"
                        ? "bg-red-50 border-red-200"
                        : "bg-green-50 border-green-200"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {new Date(oneOff.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {oneOff.type === "unavailable"
                          ? "Unavailable (All Day)"
                          : `${oneOff.startTime} - ${oneOff.endTime}`}
                      </p>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded ${
                          oneOff.type === "unavailable"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {oneOff.type.toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteOneOff(oneOff._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">ℹ️ How it works</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>
              • <strong>Weekly Schedule:</strong> Set your regular availability for each day of the week. Slots will be generated automatically for the next 30 days.
            </li>
            <li>
              • <strong>Special Dates:</strong> Override your weekly schedule for specific dates. Mark yourself as available on holidays or unavailable on specific days.
            </li>
            <li>
              • <strong>Unavailable Dates:</strong> When you mark a date as unavailable, all booked appointments on that day will be automatically cancelled and patients will be notified.
            </li>
            <li>
              • <strong>Slot Generation:</strong> Slots are automatically generated based on your consultation duration set in your profile.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}