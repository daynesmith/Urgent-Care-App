import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const apiUrl = import.meta.env.VITE_API_URL;

export default function ClinicLocationDropDown({ location, setLocation }) {
    const [locationList, setLocationList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get(`${apiUrl}/users/clinicLocations`);
                setLocationList(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching clinic locations:', err);
                setError('Failed to load location.');
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    if (loading) {
        return (
            <select
                id="location"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
                <option>Loading Location...</option>
            </select>
        );
    }

    if (error) {
        return (
            <select
                id="location"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
                <option>{error}</option>
            </select>
        );
    }

    return (
        <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
            <option value="">Select a Clinic Location</option>
            {locationList.map((user) => (
                <option key={user.cliniclocation} value={user.cliniclocation}>
                    {user.cliniclocation}
                </option>
            ))}
        </select>
    );
}

ClinicLocationDropDown.propTypes = {
    setLocation: PropTypes.func.isRequired,
    location: PropTypes.string.isRequired,
};
