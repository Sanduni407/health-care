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

      // Create Stripe checkout session
      const response = await axios.post(
        `${API_URL}/stripe/create-checkout-session`,
        {
          appointmentIds: selectedBills,
          amount: totalAmount,
          paymentMethod: 'card' // Always send 'card' since we removed online banking
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        // Redirect to Stripe checkout page
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
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <button onClick={() => navigate(-1)} className="text-gray-700 mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Payment</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Bill Summary */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h2 className="font-semibold text-gray-800 mb-3">Bill Summary</h2>
          <div className="space-y-2 mb-3">
            {bills.map((bill) => (
              <div key={bill.appointmentId} className="flex justify-between text-sm">
                <span className="text-gray-600">{bill.reason}</span>
                <span className="text-gray-800 font-medium">$ {bill.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between items-center">
            <span className="font-semibold text-gray-800">Total Amount</span>
            <span className="text-xl font-bold text-blue-600">$ {totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h2 className="font-semibold text-gray-800 mb-3">Payment Method</h2>
          <div className="space-y-2">
            {/* Card Payment */}
            <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
              paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <div className="flex items-center flex-1">
                <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <div>
                  <span className="font-medium block">Card Payment</span>
                  <span className="text-xs text-gray-500">Pay with Credit/Debit Card</span>
                </div>
              </div>
            </label>

            {/* Cash Payment */}
            <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
              paymentMethod === 'cash' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}>
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <div className="flex items-center flex-1">
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <span className="font-medium block">Cash Payment</span>
                  <span className="text-xs text-gray-500">Pay at reception</span>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Payment Info */}
        {paymentMethod === 'card' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-blue-800 font-medium">Secure Payment</p>
                <p className="text-xs text-blue-600 mt-1">You'll be redirected to Stripe's secure payment page to enter your card details.</p>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'cash' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-green-800 font-medium">Pay at Reception</p>
                <p className="text-xs text-green-600 mt-1">Please proceed to the reception desk to complete your cash payment.</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Button for Card */}
        {paymentMethod === 'card' && (
          <button
            onClick={handleStripePayment}
            disabled={processing}
            className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
              processing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {processing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Redirecting to Stripe...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                Pay with Card
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            )}
          </button>
        )}

        {/* Payment Button for Cash */}
        {paymentMethod === 'cash' && (
          <button
            onClick={handleCashPayment}
            className="w-full py-4 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 active:scale-95 transition-all"
          >
            Confirm Cash Payment
          </button>
        )}

        {/* Security Notice */}
        <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secured by Stripe - Your payment information is encrypted
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;