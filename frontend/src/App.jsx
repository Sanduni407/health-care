import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import AdminDashboard from "./pages/Profiles/AdminDashboard";
import DoctorProfile from "./pages/Profiles/DoctorProfile";
import PatientProfile from "./pages/Profiles/PatientProfile";
import ProtectedRoute from "./routes/ProtectedRoute";
import ManageUsers from './pages/Admin/ManageUsers';
import RegisterUser from './pages/Admin/RegisterUser';
import DoctorsList from './pages/Appointments/DoctorsList';
import DoctorDetail from './pages/Appointments/DoctorDetail';
import BookAppointment from './pages/Appointments/BookAppointment';
import MyAppointments from './pages/Appointments/MyAppointments';
import DoctorAvailability from './pages/Doctor/DoctorAvailability';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor-profile"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient-profile"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientProfile />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/manage-users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageUsers />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/register-user" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <RegisterUser />
          </ProtectedRoute>
        } />

        {/* Appointment Routes */}
        <Route path="/appointments" element={
          <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
            <DoctorsList />
          </ProtectedRoute>
        } />

        <Route path="/doctor/:id" element={
          <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
            <DoctorDetail />
          </ProtectedRoute>
        } />

        <Route path="/book-appointment/:id" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <BookAppointment />
          </ProtectedRoute>
        } />

        <Route path="/my-appointments" element={
          <ProtectedRoute allowedRoles={['patient', 'doctor']}>
            <MyAppointments />
          </ProtectedRoute>
        } />

        {/* Doctor Availability Route */}
        <Route path="/doctor/manage-availability" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorAvailability />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App