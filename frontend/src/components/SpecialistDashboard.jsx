import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/Usercontext";
import NotificationBell from '../components/NotificationBell';

const apiUrl = import.meta.env.VITE_API_URL;

export default function SpecialistDashboard() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pendingReferrals');
  const { userId } = useContext(UserContext);

  useEffect(() => {
    if (!userId) {
      console.warn("userId is not ready yet");
      return;
    }
    axios.get(`${apiUrl}/referrals/pending`, {
      params: { specialist_id: userId }
    })
    .then(res => {
      setReferrals(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Failed to fetch referrals:", err);
      setLoading(false);
    });
  }, [userId]);

  const handleDecision = (id, decision) => {
    axios
      .put(`${apiUrl}/referrals/${id}`, { status: decision })
      .then(() => {
        setReferrals((prev) => prev.filter((r) => r.id !== id));
      })
      .catch((err) => {
        console.error("Failed to update referral:", err);
      });
  };

  if (!userId || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold">Loading specialist dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* HEADER */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Specialist Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="p-2 relative">
                <div className="flex justify-end">
                  <NotificationBell />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Tabs/buttons */}
        <div className="flex space-x-4 mb-8">
          <button 
            onClick={() => setActiveTab('dailyAppointments')} 
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'dailyAppointments' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}>Daily Appointments
          </button>
          <button 
            onClick={() => setActiveTab('pendingReferrals')} 
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'pendingReferrals' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}>Pending Referrals
          </button>

          {/* Future tabs can go here if needed */}
        </div>

        {/* Content based on activeTab */}
        {activeTab === 'pendingReferrals' && (
          <>
            <h2 className="text-2xl font-semibold mb-6">Pending Referrals</h2>
            {referrals.length === 0 ? (
              <p className="text-gray-600">No referrals pending at this time.</p>
            ) : (
              referrals.map((referral) => (
                <div key={referral.id} className="border p-4 mb-6 rounded shadow bg-white">
                  <p><strong>Patient:</strong> {referral.patient?.firstname} {referral.patient?.lastname}</p>
                  <p><strong>Referred by:</strong> {referral.doctor?.firstname} {referral.doctor?.lastname}</p>
                  <p><strong>Reason:</strong> {referral.reason}</p>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleDecision(referral.id, "approved")}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDecision(referral.id, "denied")}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Deny
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

      </div>

    </div>
  );
}
