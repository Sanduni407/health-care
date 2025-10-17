import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Stethoscope, Edit, Calendar, MessageSquare, FileText } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { getDoctorProfile, updateDoctorProfile, uploadDoctorImage } from "../../api/doctorApi";
import Navbar from "../../components/Navbar/Navbar";

export default function DoctorProfile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: "",
    bio: "",
    education: [],
    experienceYears: 0,
    specializations: [],
    consultationDuration: 15,
    fees: 0,
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);

  // Fetch doctor profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getDoctorProfile();
        if (res.success && res.profile) {
          setProfile(res.profile);
          setForm({
            title: res.profile.title || "",
            bio: res.profile.bio || "",
            education: res.profile.education || [],
            experienceYears: res.profile.experienceYears || 0,
            specializations: res.profile.specializations || [],
            consultationDuration: res.profile.consultationDuration || 15,
            fees: res.profile.fees || 0,
            image: res.profile.image || "",
          });
        } else {
          // New doctor: no profile yet
          setProfile(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleArrayChange = (e, field) => {
    setForm({ ...form, [field]: e.target.value.split(",").map(s => s.trim()) });
  };
  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const handleSave = async () => {
    try {
      const updatedForm = { ...form };

      // Upload image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const imgRes = await uploadDoctorImage(formData);
        if (imgRes.success) updatedForm.image = imgRes.image;
      }

      const res = await updateDoctorProfile(updatedForm);
      if (res.success) {
        setProfile(res.profile);
        setForm({
          title: res.profile.title || "",
          bio: res.profile.bio || "",
          education: res.profile.education || [],
          experienceYears: res.profile.experienceYears || 0,
          specializations: res.profile.specializations || [],
          consultationDuration: res.profile.consultationDuration || 15,
          fees: res.profile.fees || 0,
          image: res.profile.image || "",
        });
        setEditing(false);
        setImageFile(null);
      } else setError(res.message);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <p className="p-8 text-center">Loading...</p>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <p className="p-8 text-center text-red-600">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-teal-600 shadow-md p-6">
        <div className="max-w-7xl mx-auto flex items-center space-x-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden">
            {form.image ? (
              <img src={`http://localhost:4000${form.image}`} alt="Doctor" className="w-full h-full object-cover"/>
            ) : (
              <Stethoscope className="w-12 h-12 text-teal-600" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-1">Welcome {user?.name} 🩺</h1>
            <p className="text-white opacity-90">{profile?.title || "Doctor"}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate("/doctor/manage-availability")}
              className="bg-white text-teal-600 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-100"
            >
              <Calendar className="w-5 h-5"/> Manage Availability
            </button>

 <button
  onClick={() => navigate("/doctor/feedbacks")}
  className="bg-white text-teal-600 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-100"
>
  <MessageSquare className="w-5 h-5"/> View Feedbacks
</button>

 <button
  onClick={() => navigate("/create-post")}
  className="bg-white text-teal-600 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-100"
>
  <FileText className="w-5 h-5"/> Create Post
</button>

<button
  onClick={() => navigate("/my-posts")}
  className="bg-white text-teal-600 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-100"
>
  <FileText className="w-5 h-5"/> My Posts
</button>
            <button
              className="bg-white text-teal-600 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-100"
              onClick={() => setEditing(true)}
            >
              <Edit className="w-5 h-5"/> {profile ? "Edit Profile" : "Create Profile"}
            </button>

            <button
              className="bg-white text-teal-600 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-100"
              onClick={() => setEditing(true)}
            >
              <Edit className="w-5 h-5"/> {profile ? "Edit Profile" : "Create Profile"}
            </button>
          </div>
        </div>
      </div>

      {/* No profile yet message */}
      {!profile && !editing && (
        <div className="max-w-7xl mx-auto p-8 text-center">
          <p className="text-gray-700 mb-4">You haven't created your doctor profile yet.</p>
          <button
            onClick={() => setEditing(true)}
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
          >
            Create Profile
          </button>
        </div>
      )}

      {/* Profile Display */}
      {profile && !editing && (
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Bio</label>
                <p className="text-gray-800 mt-1">{profile.bio || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Experience</label>
                <p className="text-gray-800 mt-1">{profile.experienceYears || 0} years</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Specializations</label>
                <p className="text-gray-800 mt-1">{profile.specializations?.join(", ") || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Education</label>
                <p className="text-gray-800 mt-1">{profile.education?.join(", ") || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Consultation Duration</label>
                <p className="text-gray-800 mt-1">{profile.consultationDuration} minutes</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Consultation Fee</label>
                <p className="text-gray-800 mt-1">${profile.fees}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Form */}
      {editing && (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g., Dr., MD, MBBS"
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Education</label>
                <input
                  type="text"
                  value={form.education.join(", ")}
                  onChange={(e) => handleArrayChange(e, "education")}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
                  placeholder="Comma separated"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Experience (years)</label>
                <input
                  type="number"
                  name="experienceYears"
                  value={form.experienceYears}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Specializations</label>
                <input
                  type="text"
                  value={form.specializations.join(", ")}
                  onChange={(e) => handleArrayChange(e, "specializations")}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
                  placeholder="Comma separated"
                />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Consultation Duration (min)</label>
                <input
                  type="number"
                  name="consultationDuration"
                  value={form.consultationDuration}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-xs text-gray-500 mt-1">This determines slot intervals</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Consultation Fee ($)</label>
                <input
                  type="number"
                  name="fees"
                  value={form.fees}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Profile Image</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                >
                  Save Profile
                </button>
                {profile && (
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}