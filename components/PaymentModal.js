"use client";

import { useState } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { X, Loader, CheckCircle } from 'lucide-react';

const CheckoutForm = ({ 
  amount, 
  doctor, 
  selectedDate, 
  selectedTime, 
  appointmentType, 
  patientNotes,
  currentUser,
  onSuccess,
  onClose 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      console.log('Stripe not loaded yet');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Creating payment intent for amount:', amount);
      
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          doctorId: doctor.id,
          appointmentType: appointmentType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();
      console.log('Received client secret');

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${currentUser.firstName} ${currentUser.lastName}`,
            email: currentUser.primaryEmailAddress?.emailAddress,
          },
        },
      });

      if (stripeError) {
        console.error('Stripe error:', stripeError);
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded, creating appointment...');
        
        // Confirm payment and create appointment
        const confirmResponse = await fetch('/api/confirm-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            doctorId: doctor.id,
            selectedDate,
            selectedTime,
            appointmentType,
            patientNotes,
            currentUser: {
              id: currentUser.id,
              firstName: currentUser.firstName,
              lastName: currentUser.lastName,
              primaryEmailAddress: currentUser.primaryEmailAddress
            },
            doctor
          }),
        });

        const result = await confirmResponse.json();

        if (result.success) {
          console.log('Appointment created successfully:', result.appointmentId);
          onSuccess(result.appointmentId);
        } else {
          setError('Failed to create appointment. Please contact support.');
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Payment Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Consultation Fee</span>
            <span className="font-medium">₹{amount}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="font-semibold">Total Amount</span>
            <span className="font-bold text-lg">₹{amount}</span>
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Test Card: 4242 4242 4242 4242 | Any future date | Any 3 digits
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 py-3 px-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ₹${amount}`
          )}
        </button>
      </div>

      {/* Security Notice */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          🔒 Your payment is secure and encrypted
        </p>
      </div>
    </form>
  );
};

export default function PaymentModal({
  show,
  onClose,
  amount,
  doctor,
  selectedDate,
  selectedTime,
  appointmentType,
  patientNotes,
  currentUser,
  onSuccess
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full mx-auto shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Complete Payment</h3>
              <p className="text-gray-600 mt-1">Secure payment for your appointment</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Payment Form */}
          <CheckoutForm
            amount={amount}
            doctor={doctor}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            appointmentType={appointmentType}
            patientNotes={patientNotes}
            currentUser={currentUser}
            onSuccess={onSuccess}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}