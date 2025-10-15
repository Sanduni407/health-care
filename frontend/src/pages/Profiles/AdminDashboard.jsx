import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import { Users, Crown } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-teal-600 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-white opacity-90 text-lg mt-1">Manage your healthcare system</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Message */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome Admin 👑
          </h2>
          <p className="text-gray-600">
            You have full control over the system. Select an option below to get started.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            title="Manage Users"
            icon={Users}
            onClick={() => navigate('/admin/manage-users')}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;