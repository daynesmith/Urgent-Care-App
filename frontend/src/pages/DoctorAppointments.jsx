import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode

const apiUrl = import.meta.env.VITE_API_URL;

export default function DoctorAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');

    const fetchAppointments = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('No access token found. Please log in again.');
            return;
        }
        
        try {
            const decoded = jwtDecode(token);
            console.log("Decoded Token:", decoded);
            if (!decoded.email) {
                setError("Invalid token structure: missing email.");
                return;
            }

            const response = await axios.get(`${apiUrl}/doctor/doctorappointmentsdaterange`, {
                headers: { 'accessToken': token },
                params: {startDate, endDate}
            });

            setAppointments(response.data.appointments);
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError('Failed to load appointments.');
        }
    };

    useEffect(() => {
        if (startDate && endDate) {
            fetchAppointments();
        }
    }, [startDate, endDate]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-center mb-4">Doctor Appointments</h2>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

            {/*date range filter*/}
            <div className="mb-4">
                <label htmlFor="startDate" className="block mb-2">Start Date</label>
                <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border p-2 rounded"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="endDate" className="block mb-2">End Date</label>
                <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border p-2 rounded"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2">Appointment ID</th>
                            <th className="border border-gray-300 p-2">Patient ID</th>
                            <th className="border border-gray-300 p-2">Doctor ID</th>
                            <th className="border border-gray-300 p-2">Date</th>
                            <th className="border border-gray-300 p-2">Time</th>
                            <th className="border border-gray-300 p-2">Status</th>
                            <th className="border border-gray-300 p-2">Recommended Specialist</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.length > 0 ? (
                            appointments.map((appointment) => (
                                <tr key={appointment.appointmentid} className="text-center border border-gray-300">
                                    <td className="border border-gray-300 p-2">{appointment.appointmentid}</td>
                                    <td className="border border-gray-300 p-2">{appointment.patientid}</td>
                                    <td className="border border-gray-300 p-2">{appointment.doctorid}</td>
                                    <td className="border border-gray-300 p-2">{appointment.requesteddate}</td>
                                    <td className="border border-gray-300 p-2">{appointment.requestedtime}</td>
                                    <td className="border border-gray-300 p-2">{appointment.appointmentstatus}</td>
                                    <td className="border border-gray-300 p-2">{appointment.recommendedspecialist || 'N/A'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center p-4">No appointments found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
