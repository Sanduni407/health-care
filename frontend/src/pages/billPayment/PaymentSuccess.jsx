import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [billData, setBillData] = useState(null);
  const [error, setError] = useState(false);

  const API_URL = 'http://localhost:4000/api';

  useEffect(() => {
    if (sessionId) {
      verifyStripePayment();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const verifyStripePayment = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_URL}/stripe/verify-payment`,
        { sessionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const session = response.data.session;
        const bill = await processPayment(session);
        
        setPaymentDetails({
          amount: session.amountTotal,
          currency: session.currency.toUpperCase(),
          transactionId: session.paymentIntent,
          date: new Date().toLocaleString()
        });
        
        setBillData(bill);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (session) => {
    try {
      const token = localStorage.getItem('token');
      const appointmentIds = session.metadata.appointmentIds.split(',');
      
      const response = await axios.post(
        `${API_URL}/bills/pay`,
        {
          appointmentIds,
          paymentMethod: 'card',
          transactionId: session.paymentIntent
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      return response.data.bill;
    } catch (error) {
      console.error('Database update error:', error);
      return null;
    }
  };

  const downloadReceipt = () => {
    if (!paymentDetails) {
      alert('Receipt data not available');
      return;
    }

    const receiptWindow = window.open('', '_blank');
    const receiptHTML = generateReceiptHTML();
    receiptWindow.document.write(receiptHTML);
    receiptWindow.document.close();
    
    setTimeout(() => {
      receiptWindow.print();
    }, 250);
  };

  const generateReceiptHTML = () => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const appointments = billData?.appointments || [];
    
    const itemsRows = appointments.map(apt => {
      const aptDate = apt.start || apt.date || apt.appointmentDate || new Date();
      return `
      <tr>
        <td>${apt.reason || 'Medical Consultation'}</td>
        <td>Dr. ${apt.doctor?.user?.name || 'Unknown'}</td>
        <td>${new Date(aptDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
        <td style="text-align: right;">$${(apt.doctor?.fees || 100).toFixed(2)}</td>
      </tr>
      `;
    }).join('');
    
    return `<!DOCTYPE html>
<html>
<head>
  <title>Payment Receipt</title>
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
        <div class="info-value">#${billData?._id?.slice(-8).toUpperCase() || 'N/A'}</div>
        
        <div class="info-label">Transaction ID</div>
        <div class="info-value">${paymentDetails.transactionId?.slice(-12) || 'N/A'}</div>
        
        <div class="info-label">Payment Date</div>
        <div class="info-value">${formattedDate}</div>
      </div>

      <div class="info-section">
        <div class="info-label">Patient Name</div>
        <div class="info-value">${billData?.patient?.name || 'N/A'}</div>
        
        <div class="info-label">Patient Email</div>
        <div class="info-value">${billData?.patient?.email || 'N/A'}</div>
        
        <div class="info-label">Payment Method</div>
        <div class="info-value">STRIPE CARD</div>
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
        <span>$${(paymentDetails.amount || 0).toFixed(2)}</span>
      </div>
      <div class="total-row">
        <span>Tax (0%):</span>
        <span>$0.00</span>
      </div>
      <div class="total-row final">
        <span>Total Paid:</span>
        <span>$${(paymentDetails.amount || 0).toFixed(2)}</span>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white/70 backdrop-blur-sm rounded-2xl p-10 shadow-xl">
          <div className="w-20 h-20 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Verifying Payment</h3>
          <p className="text-gray-600">Please wait while we confirm your transaction...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 via-teal-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white/70 backdrop-blur-sm rounded-2xl shadow-2xl p-10 text-center border-2 border-white/50">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Payment Verification Failed</h1>
          <p className="text-gray-600 mb-8 text-lg">We couldn't verify your payment. Please contact our support team for assistance.</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/outstanding-bills')}
              className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold text-lg hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Back to Bills
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-4 text-teal-600 font-semibold hover:text-teal-700 transition-all"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-teal-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-10 text-center border-2 border-white/50">
          {/* Success Icon with Animation */}
          <div className="mb-8">
            <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Payment Successful! 🎉</h1>
            <p className="text-gray-600 text-lg">Your transaction has been completed successfully</p>
          </div>

          {/* Payment Details */}
          {paymentDetails && (
            <div className="bg-gradient-to-br from-teal-50/80 to-blue-50/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border-2 border-teal-100">
              <div className="flex justify-between items-center mb-5 pb-5 border-b-2 border-teal-200">
                <div className="text-left">
                  <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                  <span className="text-4xl font-bold text-teal-600">
                    ${(paymentDetails.amount || 0).toFixed(2)}
                  </span>
                </div>
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Transaction ID
                  </span>
                  <span className="font-mono text-gray-800 font-semibold text-sm">
                    {paymentDetails.transactionId ? 
                      `...${paymentDetails.transactionId.slice(-12)}` : 
                      'N/A'
                    }
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Date & Time
                  </span>
                  <span className="text-gray-800 font-semibold">{paymentDetails.date}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Payment Method
                  </span>
                  <span className="text-gray-800 font-semibold">Stripe Card</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={downloadReceipt}
              className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="flex items-center justify-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Receipt
              </span>
            </button>

            <button
              onClick={() => navigate('/payment-history')}
              className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold text-lg hover:bg-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="flex items-center justify-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Payment History
              </span>
            </button>
            
            <button
              onClick={() => navigate('/outstanding-bills')}
              className="w-full py-4 border-2 border-teal-600 text-teal-600 rounded-xl font-bold text-lg hover:bg-teal-50 transition-all duration-300"
            >
              <span className="flex items-center justify-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Outstanding Bills
              </span>
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full py-4 text-teal-600 font-semibold hover:text-teal-700 transition-all"
            >
              <span className="flex items-center justify-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to Home
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;