import { useState, useEffect } from 'react';

import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL
import SinglePatientBill from '../components/SinglePatientBill';

export default function PatientBilling(){

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [unpaidBills, setUnpaidBills] = useState([]);
    const [pastDueBills, setPastDueBills] = useState([]);
    const [paidBills, setPaidBills] = useState([]);

    useEffect(() => {
        const fetchPatientBilling = async () => {
            try {
                const token = localStorage.getItem("accessToken");

                const response = await axios.get(`${apiUrl}/patient/patient-billing`,{
                    headers: {
                    'accessToken':token
                    }
                });

                setUnpaidBills(response.data.filter(bill => bill.status === 'unpaid'));
                setPastDueBills(response.data.filter(bill => bill.status === 'past_due'));
                setPaidBills(response.data.filter(bill => bill.status === 'paid'));

            } catch (err) {
                setError(err.message); 
            } finally {
                setLoading(false); 
            }
        };

        fetchPatientBilling();
    }, []); 

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        if (error.includes("404")) {
            return <div>You do not have a billing history</div>
        }
        return <div>Error: {error}</div>;
    }

    return (
    <div className="p-6 space-y-8 w-full max-w-4xl">
        <section>
          <h2 className="text-2xl font-semibold text-yellow-600 mb-4">Unpaid Bills</h2>
          <div className="space-y-4">
            {unpaidBills.map((bill) => (
                <SinglePatientBill key={bill.billingid} data={bill} />
            ))}
          </div>
        </section>
      
        <section>
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Past Due Bills</h2>
          <div className="space-y-4">
            {pastDueBills.map((bill) => (
                <SinglePatientBill key={bill.billingid} data={bill} />

            ))}
          </div>
        </section>
      
        <section>
          <h2 className="text-2xl font-semibold text-green-600 mb-4">Paid Bills</h2>
          <div className="space-y-4">
            {paidBills.map((bill) => (
                <SinglePatientBill key={bill.billingid} data={bill} />

            ))}
          </div>
        </section>
      </div>
    )
}
