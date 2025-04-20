import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL

export default function PaymentSuccess(){
    const { billingId } = useParams();
    const [billingInfo, setBillingInfo] = useState(null);

    useEffect(() => {

        const token = localStorage.getItem("accessToken");

        if (!token) {
            setError("No access token found. Please log in again.");
            return;
        }

        // console.log(token);

        const fetchBillingInfo = async () => {

            
            try {

                const billingStatus = JSON.stringify({status:'paid'});

                await axios.patch(`${apiUrl}/patient/update-bill-status/${billingId}`, billingStatus, {
                    headers: {
                    'accessToken':token,
                    'Content-Type': 'application/json'
                    }
                });

                const updated = await axios.get(`${apiUrl}/patient/patient-billing/${billingId}`, {
                    headers: {
                      'accessToken': token
                    }
                  });

                  setBillingInfo(updated.data);
            } catch (error) {
                console.error('Failed to fetch billing info:', error);
            }
        };
    
        if (billingId) {
          fetchBillingInfo();
        }
      }, [billingId]);

      useEffect(() => {
        const timer = setTimeout(() => {
          window.location.href = '/patient-billing';
        }, 8000); // 8 seconds
      
        return () => clearTimeout(timer); 
      }, []);


    return (
<div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-2xl shadow-lg text-center">
  <h1 className="text-2xl font-bold text-green-600 mb-4">🎉 Payment Successful</h1>

  {billingInfo ? (
    <div className="text-left space-y-2">
      <p><span className="font-semibold">🧾 Bill ID:</span> {billingInfo.billingid}</p>
      <p><span className="font-semibold">💵 Amount:</span> ${billingInfo.amount}</p>
      <p><span className="font-semibold">📌 Status:</span> {billingInfo.status}</p>
      <p className="text-sm text-gray-400 mt-4">
  Redirecting you to your billing page in 8 seconds...
</p>
    </div>
  ) : (
    <p className="text-gray-500">Loading billing details...</p>
  )}

  <button
    onClick={() => window.location.href = '/patient-billing'}
    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
  >
    Go to Billing Page
  </button>
</div>
    )
}
