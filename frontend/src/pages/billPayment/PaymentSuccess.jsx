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
      // No session ID - came from direct navigation (cash payment or old flow)
      setLoading(false);
    }
  }, [sessionId]);

  const verifyStripePayment = async () => {
    try {
      const token = localStorage.getItem('token');
      
      console.log('Verifying payment with session:', sessionId);
      
      const response = await axios.post(
        `${API_URL}/stripe/verify-payment`,
        { sessionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Verification response:', response.data);

      if (response.data.success) {
        const session = response.data.session;
        
        // Now process the payment in your system
        await processPayment(session);
        
        setPaymentDetails({
          amount: session.amountTotal,
          currency: session.currency.toUpperCase(),
          transactionId: session.paymentIntent,
          date: new Date().toLocaleString()
        });
      } else {
        console.error('Verification failed:', response.data.message);
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
      
      console.log('Processing payment for appointments:', appointmentIds);
      
      // Update your database with payment info
      const response = await axios.post(
        `${API_URL}/bills/pay`,
        {
          appointmentIds,
          paymentMethod: 'card',
          transactionId: session.paymentIntent
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Database update response:', response.data);
    } catch (error) {
      console.error('Database update error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Verification Failed</h1>
          <p className="text-gray-600 mb-6">We couldn't verify your payment. Please contact support.</p>
          <button
            onClick={() => navigate('/outstanding-bills')}
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
          >
            Back to Bills
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Success Animation */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">Your payment has been processed successfully</p>
          </div>

          {/* Payment Details */}
          {paymentDetails && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
                <span className="text-gray-600">Amount Paid</span>
                <span className="text-2xl font-bold text-green-600">
                  ${(paymentDetails.amount || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-mono text-gray-800 text-xs">
                  {paymentDetails.transactionId ? 
                    `...${paymentDetails.transactionId.slice(-10)}` : 
                    'N/A'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-600">Date & Time</span>
                <span className="text-gray-800">{paymentDetails.date}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Payment Method</span>
                <span className="text-gray-800">Stripe (Card)</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/outstanding-bills')}
              className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
            >
              View Outstanding Bills
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 text-blue-500 font-medium hover:text-blue-600 transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Receipt Download */}
        <div className="mt-4 text-center">
          <button className="text-gray-600 text-sm underline hover:text-gray-800 transition-all">
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;