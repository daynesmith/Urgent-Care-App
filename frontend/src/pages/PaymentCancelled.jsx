import { useNavigate } from 'react-router-dom';


export default function PaymentCancelled() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <h1 className="text-3xl font-semibold text-red-600">Payment Cancelled</h1>
      <p className="text-gray-700 text-lg">
        It looks like your payment was not completed. If this was a mistake, you can try again below.
      </p>

      <div className="flex gap-4 mt-6">
  <button
    onClick={() => navigate('/patient-billing')}
    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow transition duration-200"
  >
    Return to Billing Page
  </button>

  <button
    onClick={() => navigate('/dashboard')}
    className="border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg shadow transition duration-200"
  >
    Go to Home
  </button>
</div>
    </div>
  );
}