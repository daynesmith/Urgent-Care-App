import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const apiUrl = import.meta.env.VITE_API_URL


export default function DoctorDropDown({ doctor, setDoctor }) {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        //fetch the doctor list from your API
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(`${apiUrl}/doctor/doctorsNames`); 
                const formattedDoctors = response.data.map((doc) => ({
                    ...doc,
                    name: capitalizeName(doc.name), 
                }));
                setDoctors(formattedDoctors);  
                setLoading(false);
            } catch (err) {
                console.error('Error fetching doctors:', err);
                setError('Failed to load doctors.');
                setLoading(false);
            }
        };
        
        fetchDoctors();
    }, []);

    const capitalizeName = (name) => {
        return name
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    if (loading) {
        return <option>Loading doctors...</option>;
    }

    if (error) {
        return <option>{error}</option>;
    }

    return (
        <select
            id="doctor"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}  
            className="mt-1 w-full border border-gray-300 rounded-md p-2"
        >
            <option value="">Select a doctor</option>
            {doctors.map((doc) => (
                <option key={doc.doctorid} value={doc.doctorid}>  {/* use doctorid here */}
                    Dr. {doc.name}
                </option>
            ))}
        </select>
    );

}

DoctorDropDown.propTypes = {
    setDoctor: PropTypes.func.isRequired,
    doctor: PropTypes.func.isRequired // setDoctor must be a function and is required
};
