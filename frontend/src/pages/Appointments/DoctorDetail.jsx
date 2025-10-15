import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Briefcase,
  GraduationCap,
  DollarSign,
  Calendar,
  Clock,
} from "lucide-react";
import {
  getDoctorPublicProfile,
  getDoctorAvailableDates,
} from "../../api/appointmentApi";
import Navbar from "../../components/Navbar/Navbar";

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorDetails();
    fetchAvailableDates();
  }, [id]);

  const fetchDoctorDetails = async () => {
    try {
      const res = await getDoctorPublicProfile(id);
      if (res.success) {
        setDoctor(res.doctor);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAvailableDates = async () => {
    setLoading(true);
    try {
      const res = await getDoctorAvailableDates(id);
      if (res.success) {
        setAvailableDates(res.dates);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (date) => {
    navigate(`/book-appointment/${id}?date=${date}`);
  };

  if (!doctor && !loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <p className="text-gray-600 text-lg">Doctor not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {loading ? (
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <div className="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Doctor Profile Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="md:flex">
              {/* Image Section */}
              <div className="md:w-1/3 bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center p-12">
                {doctor?.image ? (
                  <img
                    src={`http://localhost:4000${doctor.image}`}
                    alt={doctor.user?.name}
                    className="w-64 h-64 rounded-full object-cover border-8 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-64 h-64 rounded-full bg-white flex items-center justify-center">
                    <User className="w-32 h-32 text-teal-600" />
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="md:w-2/3 p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {doctor?.title || "Dr."} {doctor?.user?.name}
                </h1>

                {/* Specializations */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {doctor?.specializations?.map((spec, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-teal-50 text-teal-700 text-sm font-medium rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Bio */}
                <p className="text-gray-600 mb-6">{doctor?.bio}</p>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Briefcase className="w-5 h-5 text-teal-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Experience</p>
                      <p className="font-semibold text-gray-800">
                        {doctor?.experienceYears || 0} years
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-teal-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Consultation Fee</p>
                      <p className="font-semibold text-gray-800">
                        ${doctor?.fees || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-teal-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-semibold text-gray-800">
                        {doctor?.consultationDuration || 15} minutes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-teal-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Education</p>
                      <p className="font-semibold text-gray-800">
                        {doctor?.education?.[0] || "Medical Degree"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Education List */}
                {doctor?.education && doctor.education.length > 1 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Education & Qualifications
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {doctor.education.map((edu, idx) => (
                        <li key={idx}>{edu}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Available Dates Section */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center space-x-2 mb-6">
              <Calendar className="w-6 h-6 text-teal-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Available Dates (Next 30 Days)
              </h2>
            </div>

            {availableDates.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No available dates at the moment
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableDates.map((date, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-4 hover:border-teal-500 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {new Date(date).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Slots available
                        </p>
                      </div>
                      <button
                        onClick={() => handleBookNow(date)}
                        className="px-4 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}