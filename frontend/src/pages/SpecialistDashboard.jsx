import { Link } from 'react-router-dom';
import { useEffect, useState, useContext} from "react";
import axios from "axios";
import { UserContext } from "../context/Usercontext";

const apiUrl = import.meta.env.VITE_API_URL;

export default function SpecialistDashboard() {
    const [referrals, setReferrals] = useState([]);
    const { userId } = useContext(UserContext);
    useEffect(() => {
        //console.log("🔍 userId from context:", userId);

        if(!userId) {return;}

        axios.get(`${apiUrl}/referrals/pending`, {
            params: { specialist_id: userId }
  })
    .then(res => setReferrals(res.data))
    .catch(err => console.error("Failed to fetch referrals:", err));
    }, [userId]);


  const handleDecision = (id, decision) => {
    axios
      .put(`${apiUrl}/referrals/${id}`, { status: decision })
      .then(() => {
        // Remove the referral from the list once it's approved or denied
        setReferrals((prev) => prev.filter((r) => r.id !== id));
      })
      .catch((err) => {
        console.error("Failed to update referral:", err);
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Pending Referrals</h1>
      {referrals.length === 0 ? (
        <p>No referrals pending at this time.</p>
      ) : (
        referrals.map((referral) => (
          <div key={referral.id} className="border p-4 mb-3 rounded shadow">
            <p><strong>Patient:</strong> {referral.patient?.firstname} {referral.patient?.lastname}</p>
            <p><strong>Referred by:</strong> {referral.doctor?.firstname} {referral.doctor?.lastname}</p>
            <p><strong>Reason:</strong> {referral.reason}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleDecision(referral.id, "approved")}
                className="bg-green-500 text-white px-4 py-1 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleDecision(referral.id, "denied")}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Deny
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}