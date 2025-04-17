import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const apiUrl = import.meta.env.VITE_API_URL;

export default function StaffDropDown({ staff, setStaff }) {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await axios.get(`${apiUrl}/users/getStaffUsers`);
                setStaffList(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching staff:', err);
                setError('Failed to load staff.');
                setLoading(false);
            }
        };

        fetchStaff();
    }, []);

    if (loading) {
        return (
            <select
                id="staff"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
                <option>Loading staff...</option>
            </select>
        );
    }

    if (error) {
        return (
            <select
                id="staff"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
                <option>{error}</option>
            </select>
        );
    }

    return (
        <select
            id="staff"
            value={staff}
            onChange={(e) => setStaff(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
            <option value="">Select a staff member</option>
            {staffList.map((user) => (
                <option key={user.staffid} value={user.staffid}>
                    {user.name} ({user.role})
                </option>
            ))}
        </select>
    );
}

StaffDropDown.propTypes = {
    setStaff: PropTypes.func.isRequired,
    staff: PropTypes.string.isRequired,
};
