import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
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
        await processPayment(session);
        
        setPaymentDetails({
          amount: session.amountTotal,
          currency: session.currency.toUpperCase(),
          transactionId: session.paymentIntent,
          date: new Date().toLocaleString()
        });
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
      
      await axios.post(
        `${API_URL}/bills/pay`,
        {
          appointmentIds,
          paymentMethod: 'card',
          transactionId: session.paymentIntent
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Database update error:', error);
    }
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
              onClick={() => navigate('/outstanding-bills')}
              className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold text-lg hover:bg-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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
              className="w-full py-4 border-2 border-teal-600 text-teal-600 rounded-xl font-bold text-lg hover:bg-teal-50 transition-all duration-300"
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

        {/* Receipt Download */}
        <div className="mt-6 text-center">
          <button className="text-gray-600 text-sm hover:text-teal-600 transition-all flex items-center justify-center mx-auto bg-white/50 backdrop-blur-sm px-6 py-3 rounded-lg hover:bg-white/70">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;