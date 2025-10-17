import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Calendar, FileText, Activity, ArrowRight } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { getMyAppointments } from "../../api/appointmentApi";
import Navbar from "../../components/Navbar/Navbar";

export default function PatientProfile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingAppointments();
  }, []);

  const fetchUpcomingAppointments = async () => {
    try {
      const res = await getMyAppointments();
      if (res.success) {
        // Count only booked appointments
        const upcoming = res.appointments.filter(apt => apt.status === 'booked').length;
        setUpcomingCount(upcoming);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const quickStats = [
    { 
      icon: Calendar, 
      label: "Upcoming Appointments", 
      value: loading ? "..." : upcomingCount.toString(), 
      color: "bg-teal-600",
      clickable: true,
      onClick: () => navigate("/my-appointments")
    },
    { 
      icon: FileText, 
      label: "Medical Records", 
      value: "12", 
      color: "bg-teal-500",
      clickable: false
    },
    { 
      icon: Activity, 
      label: "Health Score", 
      value: "95%", 
      color: "bg-teal-700",
      clickable: false
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header Section */}
      <div className="bg-teal-600 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-12 h-12 text-teal-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome {user?.name} ❤️
              </h1>
              <p className="text-white opacity-90 text-lg">Your health is our priority</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              onClick={stat.clickable ? stat.onClick : undefined}
              className={`bg-white rounded-lg shadow-md p-6 transition-all border border-gray-100 ${
                stat.clickable
                  ? "cursor-pointer hover:shadow-xl hover:scale-105 hover:border-teal-500"
                  : "hover:shadow-lg"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className={`w-14 h-14 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                {stat.clickable && (
                  <ArrowRight className="w-5 h-5 text-teal-600 mt-2" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mr-3">
              <Heart className="w-6 h-6 text-teal-600" />
            </div>
            Patient Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-l-4 border-teal-600 pl-4">
                <p className="text-sm text-gray-600">Blood Type</p>
                <p className="text-lg font-semibold text-gray-800">O+</p>
              </div>
              <div className="border-l-4 border-teal-500 pl-4">
                <p className="text-sm text-gray-600">Age</p>
                <p className="text-lg font-semibold text-gray-800">32 Years</p>
              </div>
              <div className="border-l-4 border-teal-700 pl-4">
                <p className="text-sm text-gray-600">Allergies</p>
                <p className="text-lg font-semibold text-gray-800">None</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-teal-600 pl-4">
                <p className="text-sm text-gray-600">Last Visit</p>
                <p className="text-lg font-semibold text-gray-800">Jan 15, 2025</p>
              </div>
              <div className="border-l-4 border-teal-500 pl-4">
                <p className="text-sm text-gray-600">Primary Doctor</p>
                <p className="text-lg font-semibold text-gray-800">Dr. Smith</p>
              </div>
              <div className="border-l-4 border-teal-700 pl-4">
                <p className="text-sm text-gray-600">Emergency Contact</p>
                <p className="text-lg font-semibold text-gray-800">+1 234 567 890</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate("/appointments")}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all border border-gray-100 hover:border-teal-500 text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">
                  Book Appointment
                </h3>
                <p className="text-gray-600">
                  Find and book appointments with doctors
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-teal-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
          

          <button
  onClick={() => navigate("/send-feedback")}
  className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all border border-gray-100 hover:border-teal-500 text-left group"
>
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">
        Send Feedback
      </h3>
      <p className="text-gray-600">
        Share your experience with doctors
      </p>
    </div>
    <ArrowRight className="w-6 h-6 text-teal-600 group-hover:translate-x-1 transition-transform" />
  </div>
</button>
   {/* manage records button */}   

          <button
  onClick={() => navigate("/health-records")}
  className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all border border-gray-100 hover:border-teal-500 text-left group"
>
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">
        Health Records
      </h3>
      <p className="text-gray-600">
        View, upload and analyze your medical records
      </p>
    </div>
    <ArrowRight className="w-6 h-6 text-teal-600 group-hover:translate-x-1 transition-transform" />
  </div>
</button> 
<button
  onClick={() => navigate("/urgent-responses")}
  className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all border border-gray-100 hover:border-red-500 text-left group"
>
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors">
        Urgent Responses
      </h3>
      <p className="text-gray-600">
        View replies from doctors
      </p>
    </div>
    <ArrowRight className="w-6 h-6 text-red-600 group-hover:translate-x-1 transition-transform" />
  </div>
</button>


          <button
            onClick={() => navigate("/my-appointments")}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all border border-gray-100 hover:border-teal-500 text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">
                  My Appointments
                </h3>
                <p className="text-gray-600">
                  View and manage your appointments
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-teal-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => navigate("/outstanding-bills")}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all border border-gray-100 hover:border-teal-500 text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">
                 View Outstanding Bills
                </h3>
                <p className="text-gray-600">
                  View and manage payments
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-teal-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

        </div>

        {/* Health Tips Card */}
        <div className="mt-8 bg-teal-600 rounded-lg shadow-md p-8 text-white border border-teal-500">
          <h3 className="text-2xl font-bold mb-4">💡 Health Tip of the Day</h3>
          <p className="text-lg opacity-90">
            Stay hydrated! Drink at least 8 glasses of water daily to maintain optimal health and boost your immune system.
          </p>
        </div>
      </div>
    </div>
  );
}