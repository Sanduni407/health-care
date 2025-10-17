import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedBills = [], totalAmount = 0, bills = [] } = location.state || {};

  const API_URL = 'http://localhost:4000/api';

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);

  const handleStripePayment = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `${API_URL}/stripe/create-checkout-session`,
        {
          appointmentIds: selectedBills,
          amount: totalAmount,
          paymentMethod: 'card'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        window.location.href = response.data.url;
      } else {
        alert(response.data.message || 'Failed to create payment session');
        setProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  const handleCashPayment = () => {
    alert('Please proceed to the reception desk to complete your cash payment.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-teal-50 to-blue-50 pb-8">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center">
          <button onClick={() => navigate(-1)} className="text-teal-600 hover:text-teal-700 transition-colors mr-4">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Payment Checkout</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Bill Summary */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border-2 border-white/50">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800">Bill Summary</h2>
          </div>
          
          <div className="space-y-3 mb-4">
            {bills.map((bill) => (
              <div key={bill.appointmentId} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-teal-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-gray-700 font-medium">{bill.reason}</span>
                </div>
                <span className="text-gray-800 font-bold text-lg">$ {bill.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t-2 border-teal-600 pt-4 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">Total Amount</span>
            <span className="text-3xl font-bold text-teal-600">$ {totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border-2 border-white/50">
          <div className="flex items-center mb-5">
            <svg className="w-6 h-6 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800">Payment Method</h2>
          </div>
          
          <div className="space-y-3">
            {/* Card Payment */}
            <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
              paymentMethod === 'card' ? 'border-teal-600 bg-teal-50/80 shadow-md' : 'border-gray-200 bg-white/50'
            }`}>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-teal-600 mr-4"
              />
              <div className="flex items-center flex-1">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <span className="font-bold text-gray-800 block text-lg">Card Payment</span>
                  <span className="text-sm text-gray-600">Secure payment via Stripe</span>
                </div>
              </div>
              {paymentMethod === 'card' && (
                <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </label>

            {/* Cash Payment */}
            <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
              paymentMethod === 'cash' ? 'border-teal-600 bg-teal-50/80 shadow-md' : 'border-gray-200 bg-white/50'
            }`}>
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-teal-600 mr-4"
              />
              <div className="flex items-center flex-1">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <span className="font-bold text-gray-800 block text-lg">Cash Payment</span>
                  <span className="text-sm text-gray-600">Pay at reception desk</span>
                </div>
              </div>
              {paymentMethod === 'cash' && (
                <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </label>
          </div>
        </div>

        {/* Payment Info */}
        {paymentMethod === 'card' && (
          <div className="bg-blue-50/80 backdrop-blur-sm border-2 border-blue-200 rounded-xl p-5 mb-6">
            <div className="flex">
              <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-blue-900 font-bold mb-1">🔒 Secure Payment Gateway</p>
                <p className="text-sm text-blue-700">You'll be redirected to Stripe's secure payment page. All card information is encrypted and never stored on our servers.</p>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'cash' && (
          <div className="bg-green-50/80 backdrop-blur-sm border-2 border-green-200 rounded-xl p-5 mb-6">
            <div className="flex">
              <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-green-900 font-bold mb-1">📍 Pay at Reception</p>
                <p className="text-sm text-green-700">Please proceed to the hospital reception desk to complete your cash payment. Bring your appointment confirmation.</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Button */}
        {paymentMethod === 'card' && (
          <button
            onClick={handleStripePayment}
            disabled={processing}
            className={`w-full py-5 rounded-xl font-bold text-lg transition-all duration-300 transform ${
              processing
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-teal-600 text-white hover:bg-teal-700 active:scale-95 shadow-lg hover:shadow-xl'
            }`}
          >
            {processing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Redirecting to Stripe...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Proceed to Secure Payment
                <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            )}
          </button>
        )}

        {paymentMethod === 'cash' && (
          <button
            onClick={handleCashPayment}
            className="w-full py-5 rounded-xl font-bold text-lg text-white bg-green-600 hover:bg-green-700 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl transform"
          >
            <span className="flex items-center justify-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Confirm Cash Payment
            </span>
          </button>
        )}

        {/* Security Notice */}
        <div className="mt-6 flex items-center justify-center text-sm text-gray-600 bg-white/50 backdrop-blur-sm rounded-lg p-3">
          <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="font-medium">Secured by Stripe • 256-bit SSL Encryption</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;