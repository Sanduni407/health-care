import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentHistory = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = 'http://localhost:4000/api';

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/bills/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setPayments(response.data.bills);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = (payment) => {
    const receiptWindow = window.open('', '_blank');
    const receiptHTML = generateReceiptHTML(payment);
    receiptWindow.document.write(receiptHTML);
    receiptWindow.document.close();
    
    setTimeout(() => {
      receiptWindow.print();
    }, 250);
  };

  const generateReceiptHTML = (payment) => {
    const date = new Date(payment.paidAt || payment.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const appointments = payment.appointments || [];
    
    const itemsRows = appointments.map(apt => {
      // Handle multiple possible date field names
      const aptDate = apt.start || apt.date || apt.appointmentDate || apt.createdAt;
      const dateObj = new Date(aptDate);
      const formattedAptDate = dateObj.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      
      return `
      <tr>
        <td>${apt.reason || 'Medical Consultation'}</td>
        <td>Dr. ${apt.doctor?.user?.name || 'Unknown'}</td>
        <td>${formattedAptDate}</td>
        <td style="text-align: right;">$${(apt.doctor?.fees || 100).toFixed(2)}</td>
      </tr>
      `;
    }).join('');
    
    return `<!DOCTYPE html>
<html>
<head>
  <title>Payment Receipt - ${payment._id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Arial', sans-serif;
      background: #f5f5f5;
      padding: 40px 20px;
    }
    .receipt {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 50px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #0d9488;
      padding-bottom: 25px;
      margin-bottom: 35px;
    }
    .header h1 {
      color: #0d9488;
      font-size: 36px;
      margin-bottom: 8px;
    }
    .header .subtitle {
      color: #666;
      font-size: 16px;
    }
    .receipt-badge {
      display: inline-block;
      background: #d1fae5;
      color: #065f46;
      padding: 8px 20px;
      border-radius: 25px;
      font-weight: bold;
      font-size: 14px;
      margin-top: 15px;
    }
    .receipt-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 35px;
      gap: 30px;
    }
    .info-section {
      flex: 1;
    }
    .info-label {
      font-weight: bold;
      color: #333;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .info-value {
      color: #555;
      font-size: 15px;
      margin-bottom: 18px;
      line-height: 1.5;
    }
    .items-section {
      margin: 35px 0;
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 25px;
    }
    .items-table thead {
      background: #f9fafb;
    }
    .items-table th {
      padding: 15px;
      text-align: left;
      font-weight: bold;
      color: #374151;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #e5e7eb;
    }
    .items-table td {
      padding: 15px;
      border-bottom: 1px solid #f3f4f6;
      color: #555;
    }
    .items-table tbody tr:last-child td {
      border-bottom: none;
    }
    .total-section {
      background: #f9fafb;
      padding: 25px;
      border-radius: 8px;
      margin-top: 30px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 15px;
    }
    .total-row.final {
      font-size: 24px;
      font-weight: bold;
      color: #0d9488;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 2px solid #0d9488;
    }
    .footer {
      margin-top: 50px;
      padding-top: 25px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
    }
    .footer-text {
      color: #666;
      font-size: 13px;
      line-height: 1.8;
    }
    .thank-you {
      font-size: 18px;
      font-weight: bold;
      color: #0d9488;
      margin-bottom: 15px;
    }
    @media print {
      body { background: white; padding: 0; }
      .receipt { box-shadow: none; padding: 30px; }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>🏥 HOSPITAL PAYMENT RECEIPT</h1>
      <p class="subtitle">Official Payment Confirmation</p>
      <div class="receipt-badge">✓ PAID</div>
    </div>

    <div class="receipt-info">
      <div class="info-section">
        <div class="info-label">Receipt Number</div>
        <div class="info-value">#${payment._id?.slice(-8).toUpperCase() || 'N/A'}</div>
        
        <div class="info-label">Transaction ID</div>
        <div class="info-value">${payment.transactionId || 'N/A'}</div>
        
        <div class="info-label">Payment Date</div>
        <div class="info-value">${formattedDate}</div>
      </div>

      <div class="info-section">
        <div class="info-label">Patient Name</div>
        <div class="info-value">${payment.patient?.name || 'N/A'}</div>
        
        <div class="info-label">Patient Email</div>
        <div class="info-value">${payment.patient?.email || 'N/A'}</div>
        
        <div class="info-label">Payment Method</div>
        <div class="info-value">${payment.paymentMethod?.toUpperCase() || 'CARD'}</div>
      </div>
    </div>

    <div class="items-section">
      <div class="section-title">Appointment Details</div>
      <table class="items-table">
        <thead>
          <tr>
            <th>Appointment</th>
            <th>Doctor</th>
            <th>Date</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>
    </div>

    <div class="total-section">
      <div class="total-row">
        <span>Subtotal:</span>
        <span>$${(payment.totalAmount || 0).toFixed(2)}</span>
      </div>
      <div class="total-row">
        <span>Tax (0%):</span>
        <span>$0.00</span>
      </div>
      <div class="total-row final">
        <span>Total Paid:</span>
        <span>$${(payment.paidAmount || 0).toFixed(2)}</span>
      </div>
    </div>

    <div class="footer">
      <div class="thank-you">Thank you for your payment!</div>
      <p class="footer-text">
        This is an official receipt for your payment.<br>
        For any queries, please contact our billing department.<br>
        <strong>Email:</strong> billing@hospital.com | <strong>Phone:</strong> +1 (555) 123-4567
      </p>
    </div>
  </div>
</body>
</html>`;
  };

  const filteredPayments = payments.filter(payment => {
    const searchLower = searchTerm.toLowerCase();
    return (
      payment._id?.toLowerCase().includes(searchLower) ||
      payment.transactionId?.toLowerCase().includes(searchLower) ||
      payment.paymentMethod?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading payment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-teal-50 to-blue-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-teal-600 hover:text-teal-700 transition-colors">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
          <div className="w-7"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by receipt ID, transaction ID, or payment method..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-4 pl-14 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
            />
            <svg className="w-6 h-6 text-gray-400 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Payments Table */}
        {filteredPayments.length === 0 ? (
          <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-xl">
            <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Payment History</h3>
            <p className="text-gray-500">You haven't made any payments yet.</p>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border-2 border-white/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-teal-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Receipt ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Appointments</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Payment Method</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPayments.map((payment) => {
                    const paymentDate = new Date(payment.paidAt || payment.createdAt);
                    const formattedPaymentDate = paymentDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    });
                    
                    return (
                      <tr key={payment._id} className="hover:bg-teal-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-semibold text-gray-800">
                            #{payment._id?.slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {formattedPaymentDate}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-700 font-medium">
                            {payment.appointments?.length || 0} appointment(s)
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                            {payment.paymentMethod?.toUpperCase() || 'CARD'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-lg font-bold text-teal-600">
                            ${(payment.paidAmount || 0).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                            ✓ Paid
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => downloadReceipt(payment)}
                            className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary Card */}
        {filteredPayments.length > 0 && (
          <div className="mt-8 bg-gradient-to-br from-teal-50/80 to-blue-50/80 backdrop-blur-sm rounded-xl p-6 border-2 border-teal-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Payments Made</p>
                <p className="text-3xl font-bold text-teal-600">{filteredPayments.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Total Amount Paid</p>
                <p className="text-3xl font-bold text-teal-600">
                  ${filteredPayments.reduce((sum, p) => sum + (p.paidAmount || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;