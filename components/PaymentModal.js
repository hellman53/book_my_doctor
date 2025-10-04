// components/PaymentModal.js
import { useState } from 'react';
import {
    loadStripe,
    StripeElements,
    Elements,
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { X, CreditCard, Shield, CheckCircle } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({
    amount,
    doctorName,
    onSuccess,
    onClose,
    appointmentDetails
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            // Create payment intent
            const response = await fetch('/api/stripe/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amount,
                    currency: 'inr',
                    metadata: {
                        doctorId: appointmentDetails.doctorId,
                        doctorName: doctorName,
                        appointmentType: appointmentDetails.appointmentType,
                        appointmentDate: appointmentDetails.appointmentDate,
                        appointmentTime: appointmentDetails.appointmentTime,
                        patientId: appointmentDetails.patientId,
                    }
                }),
            });

            const { clientSecret, paymentIntentId } = await response.json();

            // Confirm payment with Stripe
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: appointmentDetails.patientName,
                        email: appointmentDetails.patientEmail,
                    },
                },
            });

            if (result.error) {
                setError(result.error.message);
                setProcessing(false);
            } else {
                // Payment succeeded
                onSuccess(paymentIntentId);
            }
        } catch (err) {
            setError('Payment failed. Please try again.');
            setProcessing(false);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#374151',
                '::placeholder': {
                    color: '#9CA3AF',
                },
                padding: '16px',
            },
        },
        hidePostalCode: true,
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Details</h3>
                <p className="text-gray-600">Complete your appointment booking with Dr. {doctorName}</p>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Consultation Fee</span>
                    <span className="font-semibold">₹{amount}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total Amount</span>
                    <span className="text-emerald-600">₹{amount}</span>
                </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Card Details
                    </label>
                    <div className="border border-gray-300 rounded-xl p-4 hover:border-emerald-500 transition-colors">
                        <CardElement options={cardElementOptions} />
                    </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Shield className="h-4 w-4" />
                    <span>Payments are secure and encrypted</span>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!stripe || processing}
                        className="flex-1 py-3 px-6 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard className="h-5 w-5" />
                                Pay ₹{amount}
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Test Card Info */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <h4 className="font-semibold text-yellow-800 mb-2 text-sm">Test Card Details:</h4>
                <div className="text-yellow-700 text-sm space-y-1">
                    <div>Card: 4242 4242 4242 4242</div>
                    <div>Expiry: Any future date</div>
                    <div>CVC: Any 3 digits</div>
                </div>
            </div>
        </div>
    );
};

export default function PaymentModal({
    isOpen,
    onClose,
    amount,
    doctorName,
    onSuccess,
    appointmentDetails
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full mx-auto shadow-2xl">
                <div className="relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <Elements stripe={stripePromise}>
                        <CheckoutForm
                            amount={amount}
                            doctorName={doctorName}
                            onSuccess={onSuccess}
                            onClose={onClose}
                            appointmentDetails={appointmentDetails}
                        />
                    </Elements>
                </div>
            </div>
        </div>
    );
}