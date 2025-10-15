import { User, Briefcase, GraduationCap, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DoctorCard({ doctor }) {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/doctor/${doctor._id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden">
      {/* Doctor Image */}
      <div className="h-48 bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center overflow-hidden">
        {doctor.image ? (
          <img
            src={`http://localhost:4000${doctor.image}`}
            alt={doctor.user?.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-20 h-20 text-white" />
        )}
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Doctor Name & Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-1">
          {doctor.title || "Dr."} {doctor.user?.name}
        </h3>
        
        {/* Specializations */}
        <div className="flex flex-wrap gap-2 mb-3">
          {doctor.specializations?.slice(0, 2).map((spec, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full"
            >
              {spec}
            </span>
          ))}
          {doctor.specializations?.length > 2 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              +{doctor.specializations.length - 2} more
            </span>
          )}
        </div>

        {/* Bio */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {doctor.bio || "Experienced healthcare professional"}
        </p>

        {/* Info Grid */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="w-4 h-4 mr-2 text-teal-600" />
            <span>{doctor.experienceYears || 0} years experience</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <GraduationCap className="w-4 h-4 mr-2 text-teal-600" />
            <span className="line-clamp-1">
              {doctor.education?.[0] || "Medical Degree"}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-2 text-teal-600" />
            <span>Consultation Fee: ${doctor.fees || 0}</span>
          </div>
        </div>

        {/* View Profile Button */}
        <button
          onClick={handleViewProfile}
          className="w-full py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors"
        >
          View Profile & Book
        </button>
      </div>
    </div>
  );
}