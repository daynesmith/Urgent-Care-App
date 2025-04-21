import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const apiUrl = import.meta.env.VITE_API_URL;

export default function SpecialistDropDown({ selected, setSelected }) {
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpecialists = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError("No access token found. Please log in again.");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const email = decoded.email;

        if (!email) {
          setError("Invalid token structure: missing email.");
          return;
        }

        console.log("Fetching approved referrals for email:", email);

        const response = await axios.get(`${apiUrl}/patient/patientSpecialists`, {
          headers: {
            accessToken: token, 
          },
        });

        console.log("Approved referrals response:", response.data);

        const uniqueSpecialists = [];
        const seenSpecialists = new Set();
        for (const ref of response.data) {
          const spec = ref.specialist;
          if (!seenSpecialists.has(spec.user_id)) {
            seenSpecialists.add(spec.user_id);
            uniqueSpecialists.push(spec);
          }
        }

        setSpecialists(uniqueSpecialists);
      } catch (err) {
        console.error("Failed to load specialists:", err);
        setError("Failed to load specialists.");
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialists();
  }, []);

  if (loading) {
    return <div>Loading specialists...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <select
      id="specialist"
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="mt-1 w-full border border-gray-300 rounded-md p-2"
    >
      <option value="">Select a specialist</option>
      {specialists.map((spec) => (
        <option key={spec.user_id} value={spec.user_id}>
          Dr. {spec.firstname} {spec.lastname} ({spec.specialty})
        </option>
      ))}
    </select>
  );
}