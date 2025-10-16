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

      console.log('Fetching from:', `${API_URL}/outstanding`);
      console.log('Token exists:', !!token);

      const response = await axios.get(`${API_URL}/outstanding`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Response:', response.data);

      if (response.data.success) {
        setBills(response.data.bills);
        console.log('Bills loaded:', response.data.bills.length);
      } else {
        console.error('API Error:', response.data.message);
        alert(response.data.message || 'Failed to fetch bills');
      }
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        navigate('/login');
      } else if (error.response?.status === 404) {
        alert('API endpoint not found. Check if backend routes are registered.');
      } else {
        alert(`Error: ${error.response?.data?.message || error.message || 'Failed to load bills'}`);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Outstanding Bills</h1>
          <button className="text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search bills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Bills List */}
        {filteredBills.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500">No outstanding bills</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBills.map((bill) => (
              <div
                key={bill.appointmentId}
                className={`bg-white rounded-lg shadow-sm border-2 transition-all ${
                  selectedBills.includes(bill.appointmentId)
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-transparent'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{bill.reason}</h3>
                      <p className="text-sm text-gray-600">Patient ID: P{bill.patientId.toString().slice(-6)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-800">$ {bill.amount.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleSelectBill(bill.appointmentId)}
                      className={`px-6 py-2 rounded-lg font-medium transition-all ${
                        selectedBills.includes(bill.appointmentId)
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {selectedBills.includes(bill.appointmentId) ? 'Deselect' : 'Select Bill'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total Selected Section */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-medium">Total Selected</span>
            <span className="text-xl font-bold text-gray-800">$ {totalSelected.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-500">{selectedBills.length} bill(s) selected</p>
        </div>
      </div>

      {/* Bottom Payment Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto">
        <button
          onClick={handleProceedToPayment}
          disabled={selectedBills.length === 0}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
            selectedBills.length === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 active:scale-95'
          }`}
        >
          Pay Selected Bills
        </button>
      </div>
    </div>
  );
};

export default OutstandingBills;