import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const apiUrl = import.meta.env.VITE_API_URL;

export default function ProviderDropDown({ selected, setSelected }) {
  const [doctors, setDoctors] = useState([]);
  const [specialists, setSpecialists] = useState([]);

  useEffect(() => {
    const fetchProviders = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        console.log(jwtDecode(token))
        const patientId = decoded.patientid || decoded.userid;

        if (!patientId) {
          console.warn("No patientId found in token — aborting referral fetch.");
          return;
        }

        const [doctorRes, referralRes] = await Promise.all([
          axios.get(`${apiUrl}/doctors`, { headers: { accessToken: token } }),
          axios.get(`${apiUrl}/referrals/approved?patient_id=${patientId}`, { headers: { accessToken: token } }),
        ]);

        const uniqueDoctors = [];
        const seenDocs = new Set();

        for (const doc of doctorRes.data) {
          if (!seenDocs.has(doc.doctorid)) {
            seenDocs.add(doc.doctorid);
            uniqueDoctors.push(doc);
          }
        }
        const uniqueSpecialists = [];
        const seen = new Set();

        for (const ref of referralRes.data) {
          const spec = ref.specialist;
          if (!seen.has(spec.user_id)) {
            seen.add(spec.user_id);
            uniqueSpecialists.push(spec);
          }
        }

        setDoctors(uniqueDoctors);
        setSpecialists(uniqueSpecialists);
      } catch (error) {
        console.error("Failed to load providers:", error);
      }
    };

    fetchProviders();
  }, []);

  return (
    <select
      id="provider"
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="mt-1 w-full border border-gray-300 rounded-md p-2"
    >
      <option value="">Select a doctor or specialist</option>

      <optgroup label="Doctors">
        {doctors.map(doc => (
          <option key={`doc-${doc.doctorid}`} value={`doctor-${doc.doctorid}`}>
            Dr. {doc.firstname} {doc.lastname}
          </option>
        ))}
      </optgroup>

      <optgroup label="Specialists (Approved Referrals)">
        {specialists.map(spec => (
          <option key={`spec-${spec.user_id}`} value={`specialist-${spec.user_id}`}>
            Dr. {spec.firstname} {spec.lastname}
          </option>
        ))}
      </optgroup>
    </select>
  );
}
