// import { Link } from 'react-router-dom'
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL


export default function SinglePatientBill(props){

    const handlePay = async (billingid, amount) => {

        const billingData = JSON.stringify({
            amount,
            billingId: billingid
        });
        

        try {
          const response = await axios.post(`${apiUrl}/api/stripe/create-checkout-session`, billingData, {
            headers: { 'Content-Type': 'application/json' }
          });
      
          const { url } = response.data;

          if (url) {
            window.location.href = url;
          }
        } catch (error) {
          console.error('Payment failed:', error);
        }
      };

    return (
        <div
        key={props.data.billingid}
        className="border border-gray-200 bg-gray-50 p-4 rounded-xl shadow-sm w-full max-w-xl flex place-content-between"
        >
        <div>
            <p className="text-lg font-medium">Amount: ${props.data.amount}</p>
            <p className="text-sm text-gray-600">
            Due: {new Date(props.data.dueDate).toLocaleDateString()}
            </p>
        </div>{props.data.status != "paid" && (<button onClick={() => handlePay(props.data.billingid, props.data.amount)} className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer">
                Pay
            </button>)}
            
      </div>
    )
}