import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const apiUrl = import.meta.env.VITE_API_URL;

export default function PatientDropDown({ patient, setPatient }) {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get(`${apiUrl}/patient/patientsNames`);
                setPatients(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching patients:', err);
                setError('Failed to load patients.');
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    if (loading) {
        return <option>Loading patient...</option>;
    }

    if (error) {
        return <option>{error}</option>;
    }

    return (
        <select
            id="patient"
            value={patient}
            onChange={(e) => setPatient(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-md p-2"
        >
            <option value="">Select a patient</option>
            {patients.map((pat) => (
                <option key={pat.patientid} value={pat.patientid}>
                    {pat.name}
                </option>
            ))}
        </select>
    );
}

PatientDropDown.propTypes = {
    setPatient: PropTypes.func.isRequired,
    patient: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
