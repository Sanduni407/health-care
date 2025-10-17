import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OutstandingBills = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [selectedBills, setSelectedBills] = useState([]);
  const [totalSelected, setTotalSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = 'http://localhost:4000/api/bills';

  useEffect(() => {
    fetchOutstandingBills();
  }, []);

  useEffect(() => {
    const total = bills
      .filter(bill => selectedBills.includes(bill.appointmentId))
      .reduce((sum, bill) => sum + bill.amount, 0);
    setTotalSelected(total);
  }, [selectedBills, bills]);

  const fetchOutstandingBills = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/outstanding`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setBills(response.data.bills);
      } else {
        alert(response.data.message || 'Failed to fetch bills');
      }
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        navigate('/login');
      } else {
        alert('Failed to load bills. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBill = (appointmentId) => {
    setSelectedBills(prev => 
      prev.includes(appointmentId)
        ? prev.filter(id => id !== appointmentId)
        : [...prev, appointmentId]
    );
  };

  const handleProceedToPayment = () => {
    if (selectedBills.length === 0) {
      alert('Please select at least one bill');
      return;
    }
    navigate('/payment', { 
      state: { 
        selectedBills, 
        totalAmount: totalSelected, 
        bills: bills.filter(bill => selectedBills.includes(bill.appointmentId))
      } 
    });
  };

  const filteredBills = bills.filter(bill =>
    bill.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading bills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-teal-50 to-blue-50 pb-24">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-teal-600 hover:text-teal-700 transition-colors">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Outstanding Bills</h1>
          <div className="w-7"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by appointment reason or doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-4 pl-14 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm text-gray-700 placeholder-gray-400"
            />
            <svg className="w-6 h-6 text-gray-400 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Bills List */}
        {filteredBills.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Outstanding Bills</h3>
            <p className="text-gray-500">You're all caught up! No pending payments at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBills.map((bill) => (
              <div
                key={bill.appointmentId}
                className={`bg-white/70 backdrop-blur-sm rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  selectedBills.includes(bill.appointmentId)
                    ? 'border-teal-600 bg-teal-50/80 shadow-md'
                    : 'border-white/50 hover:border-gray-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{bill.reason}</h3>
                      <p className="text-sm text-gray-600 flex items-center">
                        <svg className="w-4 h-4 mr-1.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Patient ID: P{bill.patientId.toString().slice(-6)}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <svg className="w-4 h-4 mr-1.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Dr. {bill.doctorName}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-600 mb-1">Amount Due</p>
                      <p className="text-2xl font-bold text-teal-600">$ {bill.amount.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSelectBill(bill.appointmentId)}
                      className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                        selectedBills.includes(bill.appointmentId)
                          ? 'bg-red-500 text-white hover:bg-red-600 shadow-md'
                          : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md'
                      }`}
                    >
                      {selectedBills.includes(bill.appointmentId) ? (
                        <span className="flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Deselect
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Select Bill
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total Selected Section */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border-2 border-white/50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold text-gray-700">Total Selected</span>
            <span className="text-3xl font-bold text-teal-600">$ {totalSelected.toFixed(2)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {selectedBills.length} bill(s) selected for payment
          </div>
        </div>
      </div>

      {/* Bottom Payment Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl p-6 max-w-4xl mx-auto">
        <button
          onClick={handleProceedToPayment}
          disabled={selectedBills.length === 0}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
            selectedBills.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-teal-600 text-white hover:bg-teal-700 active:scale-95 shadow-lg hover:shadow-xl'
          }`}
        >
          {selectedBills.length === 0 ? (
            'Select bills to proceed'
          ) : (
            <span className="flex items-center justify-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Pay Selected Bills
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default OutstandingBills;