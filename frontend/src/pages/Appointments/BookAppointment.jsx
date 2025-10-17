import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Calendar, Clock, User, Phone, FileText, CheckCircle, X, AlertCircle } from "lucide-react";
import {
  getDoctorPublicProfile,
  getDoctorSlotsByDate,
  bookAppointment,
} from "../../api/appointmentApi";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar/Navbar";

export default function BookAppointment() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const selectedDate = searchParams.get("date");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);

  const [form, setForm] = useState({
    patientName: user?.name || "",
    phone: "",
    reason: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchDoctorAndSlots();
  }, [id, selectedDate]);

  const fetchDoctorAndSlots = async () => {
    setLoading(true);
    try {
      const [doctorRes, slotsRes] = await Promise.all([
        getDoctorPublicProfile(id),
        getDoctorSlotsByDate(id, selectedDate),
      ]);

      if (doctorRes.success) setDoctor(doctorRes.doctor);
      if (slotsRes.success) setSlots(slotsRes.slots);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSlotSelect = (slot) => {
    if (!slot.isBooked) {
      setSelectedSlot(slot);
      setError(null); // Clear any previous errors
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedSlot) {
    setError("Please select a time slot");
    return;
  }

  // ✅ Added validation for 10-digit phone and required reason
  if (!/^\d{10}$/.test(form.phone)) {
    setError("Please enter a valid 10-digit mobile number");
    return;
  }

  if (!form.reason.trim()) {
    setError("Please enter a reason for your appointment");
    return;
  }

  setLoading(true);
  setError(null);
  setShowError(false);

  try {
    const res = await bookAppointment({
      slotId: selectedSlot._id,
      reason: form.reason,
      phone: form.phone,
    });

    if (res.success) {
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/my-appointments");
      }, 3000);
    } else {
      setError(res.message);
      setErrorDetails({
        selectedSlot: selectedSlot,
        attemptedDate: selectedDate,
        doctorName: doctor?.user?.name,
      });
      setShowError(true);
      setLoading(false);
    }
  } catch (err) {
    setError(err.message || "Failed to book appointment");
    setErrorDetails({
      selectedSlot: selectedSlot,
      attemptedDate: selectedDate,
      doctorName: doctor?.user?.name,
    });
    setShowError(true);
    setLoading(false);
  }
};


  const handleTryAgain = () => {
    setShowError(false);
    setError(null);
    setErrorDetails(null);
    setSelectedSlot(null);
    fetchDoctorAndSlots(); // Refresh slots
  };

  if (loading && !doctor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <div className="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Success Modal
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Appointment Booked Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your appointment with {doctor?.user?.name} has been confirmed.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <p className="text-sm text-gray-600 mb-2">Appointment Details:</p>
              <p className="font-semibold text-gray-800">
                Date: {new Date(selectedSlot?.start).toLocaleDateString()}
              </p>
              <p className="font-semibold text-gray-800">
                Time: {formatTime(selectedSlot?.start)} - {formatTime(selectedSlot?.end)}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Redirecting to your appointments...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error Modal
  if (showError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Appointment Booking Failed
            </h2>
            
            {/* Error Message */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <p className="text-red-700 font-semibold mb-2">Reason:</p>
              <p className="text-red-600">{error}</p>
            </div>

            {/* Attempted Booking Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <p className="text-sm text-gray-600 mb-2">Attempted Booking:</p>
              <p className="font-semibold text-gray-800">
                Doctor: {errorDetails?.doctorName}
              </p>
              <p className="font-semibold text-gray-800">
                Date: {new Date(errorDetails?.selectedSlot?.start).toLocaleDateString()}
              </p>
              <p className="font-semibold text-gray-800">
                Time: {formatTime(errorDetails?.selectedSlot?.start)} - {formatTime(errorDetails?.selectedSlot?.end)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 justify-center">
              <button
                onClick={handleTryAgain}
                className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-colors"
              >
                Try Another Slot
              </button>
              <button
                onClick={() => navigate("/my-appointments")}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition-colors"
              >
                View My Appointments
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Book Appointment
              </h1>
              <p className="text-gray-600">
                {doctor?.user?.name} - {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Slots Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Clock className="w-6 h-6 text-teal-600" />
              <h2 className="text-xl font-bold text-gray-800">
                Select Time Slot
              </h2>
            </div>

            {slots.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No slots available for this date
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {slots.map((slot) => (
                  <button
                    key={slot._id}
                    onClick={() => handleSlotSelect(slot)}
                    disabled={slot.isBooked}
                    className={`relative p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      slot.isBooked
                        ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                        : selectedSlot?._id === slot._id
                        ? "bg-teal-50 border-teal-600 text-teal-700"
                        : "bg-white border-gray-300 text-gray-700 hover:border-teal-500"
                    }`}
                  >
                    {slot.isBooked && (
                      <X className="absolute top-1 right-1 w-4 h-4 text-red-500" />
                    )}
                    <div>
                      {formatTime(slot.start)}
                    </div>
                    <div className="text-xs">
                      {formatTime(slot.end)}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedSlot && (
              <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                <p className="text-sm font-medium text-teal-800">
                  Selected Slot:
                </p>
                <p className="text-teal-700">
                  {formatTime(selectedSlot.start)} - {formatTime(selectedSlot.end)}
                </p>
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <FileText className="w-6 h-6 text-teal-600" />
              <h2 className="text-xl font-bold text-gray-800">
                Appointment Details
              </h2>
            </div>

            {error && !showError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Patient Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  Patient Name
                </label>
                <input
                  type="text"
                  value={form.patientName}
                  onChange={(e) =>
                    setForm({ ...form, patientName: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline w-4 h-4 mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  placeholder="+1 234 567 8900"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Reason for Visit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="inline w-4 h-4 mr-1" />
                  Reason for Visit
                </label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  rows="4"
                  placeholder="Describe your symptoms or reason for consultation..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Booking Date (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Booking Date
                </label>
                <input
                  type="text"
                  value={new Date(selectedDate).toLocaleDateString()}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !selectedSlot}
                className={`w-full py-3 rounded-md font-semibold transition-all ${
                  loading || !selectedSlot
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
              >
                {loading ? "Booking..." : "Confirm Appointment"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}