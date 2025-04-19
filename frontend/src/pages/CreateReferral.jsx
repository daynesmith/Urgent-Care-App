import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/Usercontext';

const apiUrl = import.meta.env.VITE_API_URL;

export default function CreateReferralForm() {
  const { userId } = useContext(UserContext);
  const [formData, setFormData] = useState({
    patient_id: '',
    specialist_id: '',
    reason: '',
  });

  const [patients, setPatients] = useState([]);
  const [specialists, setSpecialists] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get(`${apiUrl}/patient/by-doctor`, {
          params: { doctor_id: userId },
        });
        setPatients(res.data);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      }
    };

    const fetchSpecialists = async () => {
      try {
        const res = await axios.get(`${apiUrl}/specialists`);
        setSpecialists(res.data);
      } catch (err) {
        console.error("Failed to fetch specialists:", err);
      }
    };

    if (userId) {
      fetchPatients();
      fetchSpecialists();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('accessToken'); // get token if needed
      //const patient = await Patients.findOne({ where: { userid: user.userid } });

      const payload = {
        doctor_id: userId,
        patient_id: formData.patient_id,   // patient selected
        specialist_id: formData.specialist_id, // specialist selected
        reason: formData.reason            // reason typed in
      };

      await axios.post(`${apiUrl}/referrals`, payload, {
        headers: {
          accessToken: token
        }}
      );
      alert('Referral successfully created!');
      setFormData({ patient_id: '', specialist_id: '', reason: '' });

    } 
    catch (err) {
      console.error("Error creating referral:", err);
      if (err.response?.data?.error) {
        alert(err.response.data.error);
      } else {
        alert("Failed to create referral.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border rounded shadow-md space-y-4 max-w-md mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Referral</h2>

      <select
        name="patient_id"
        value={formData.patient_id}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      >
        <option value="">Select a Patient</option>
        {patients.map((patient) => (
          <option key={patient.patientid} value={patient.patientid}>
            {patient.firstname} {patient.lastname}
          </option>
        ))}
      </select>

      <select
        name="specialist_id"
        value={formData.specialist_id}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      >
        <option value="">Select a Specialist</option>
        {specialists.map((spec) => (
          <option key={spec.user_id} value={spec.user_id}>
            {spec.firstname} {spec.lastname} - {spec.specialty}
          </option>
        ))}
      </select>

      <textarea
        name="reason"
        placeholder="Reason for Referral"
        value={formData.reason}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      ></textarea>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Submit Referral
      </button>
    </form>
  );
}
