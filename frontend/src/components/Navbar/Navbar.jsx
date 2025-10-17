import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { UserCircle, LogOut, User, Calendar, Users } from "lucide-react";
import NotificationBell from "../NotificationBell";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    if (user.role === "doctor") navigate("/doctor-profile");
    else navigate("/patient-profile");
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Hospita<span className="text-teal-600">Auto</span>manager
            </h2>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 text-teal-600 font-medium hover:text-teal-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {/* Community Button */}
                <Link
                  to="/community"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-teal-600 transition-colors rounded-md hover:bg-gray-50"
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Community</span>
                </Link>

                {/* Make Appointment Button */}
                {user.role !== "admin" && (
                  <Link
                    to="/appointments"
                    className="flex items-center space-x-2 px-6 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Make Appointment</span>
                  </Link>
                )}

                {/* Notification Bell */}
                <NotificationBell />

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-teal-600 transition-colors rounded-md hover:bg-gray-50"
                  >
                    <UserCircle className="w-6 h-6" />
                    <span className="font-medium">{user.name}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsDropdownOpen(false)}
                      ></div>
                      {/* Dropdown */}
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                        <button
                          onClick={handleProfileClick}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-left"
                        >
                          <User className="w-4 h-4" />
                          <span>My Profile</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}