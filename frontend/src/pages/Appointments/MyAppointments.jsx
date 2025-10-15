import { useState, useEffect, useContext } from "react";
import { Calendar, Clock, User, Phone, FileText, XCircle, CheckCircle } from "lucide-react";
import { getMyAppointments, cancelAppointment } from "../../api/appointmentApi";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar/Navbar";

export default function MyAppointments() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await getMyAppointments();
      if (res.success) {
        setAppointments(res.appointments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      const res = await cancelAppointment(appointmentId);
      if (res.success) {
        fetchAppointments(); // Refresh list
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert("Failed to cancel appointment");
    }
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "booked":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === "all") return true;
    return apt.status === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            My Appointments
          </h1>
          <p className="text-gray-600">
            View and manage your medical appointments
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === "all"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({appointments.length})
            </button>
            <button
              onClick={() => setFilter("booked")}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === "booked"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Booked (
              {appointments.filter((a) => a.status === "booked").length})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === "completed"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Completed (
              {appointments.filter((a) => a.status === "completed").length})
            </button>
            <button
              onClick={() => setFilter("cancelled")}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === "cancelled"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cancelled (
              {appointments.filter((a) => a.status === "cancelled").length})
            </button>
          </div>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No appointments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      {/* Doctor Image */}
                      <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                        {appointment.doctor?.image ? (
                          <img
                            src={`http://localhost:4000${appointment.doctor.image}`}
                            alt="Doctor"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-teal-600" />
                        )}
                      </div>

                      {/* Appointment Info */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {appointment.doctor?.user?.name || "Doctor"}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {appointment.status.toUpperCase()}
                          </span>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
                              appointment.paymentStatus
                            )}`}
                          >
                            Payment: {appointment.paymentStatus.toUpperCase()}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-teal-600" />
                            <span>{formatDateTime(appointment.start)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-teal-600" />
                            <span>
                              Duration:{" "}
                              {appointment.doctor?.consultationDuration || 15}{" "}
                              minutes
                            </span>
                          </div>
                          {appointment.phone && (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2 text-teal-600" />
                              <span>{appointment.phone}</span>
                            </div>
                          )}
                          {appointment.reason && (
                            <div className="flex items-start">
                              <FileText className="w-4 h-4 mr-2 text-teal-600 mt-0.5" />
                              <span>{appointment.reason}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    {appointment.status === "booked" && (
                      <button
                        onClick={() => handleCancelAppointment(appointment._id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>

                  {/* Specializations */}
                  {appointment.doctor?.specializations && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                      {appointment.doctor.specializations.map((spec, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}