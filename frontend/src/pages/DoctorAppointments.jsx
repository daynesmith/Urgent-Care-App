import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;


export default function DoctorAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

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
                            <th className="border border-gray-300 p-2">Patient Name</th>
                            <th className="border border-gray-300 p-2">Date</th>
                            <th className="border border-gray-300 p-2">Time</th>
                            <th className="border border-gray-300 p-2">Status</th>
                            <th className="border border-gray-300 p-2">Recommended Specialist</th>
                            <th className="border border-gray-300 p-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.length > 0 ? (
                            appointments.map((appointment) => (
                                <tr key={appointment.appointmentid} className="text-center border border-gray-300">
                                    <td className="border border-gray-300 p-2">{appointment.patientname}</td>
                                    <td className="border border-gray-300 p-2">{appointment.requesteddate}</td>
                                    <td className="border border-gray-300 p-2">{appointment.requestedtime}</td>
                                    <td className="border border-gray-300 p-2">{appointment.appointmentstatus}</td>
                                    <td className="border border-gray-300 p-2">{appointment.recommendedspecialist || 'N/A'}</td>

                                    {/*added visit info button */}
                                    <td className="border border-gray-300 p-2">
                                        <button
                                            onClick={() => navigate(`/editvisit/${appointment.appointmentid}`)} 
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                        >
                                            Edit Visit Info
                                        </button>
                                    </td>
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


//visitinfo popup
function VisitInfoModal({appointment, onClose}) {
    const [doctorNotes, setDoctorNotes] = useState('');
    const [notesForPatient, setNotesForPatient] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVisitInfo = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const res = await axios.get(`${apiUrl}/visitinfo/getvisitinfo/${appointment.appointmentid}`, {
                    headers: { accessToken: token }
                });
                setDoctorNotes(res.data.doctornotes || '');
                setNotesForPatient(res.data.notesforpatient || '');
            } catch (err) {
                console.log('No existing visit info or failed to load.');
            } finally {
                setLoading(false);
            }
        };
        fetchVisitInfo();
    }, [appointment]);

    const handleSave = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            await axios.post(`${apiUrl}/visitinfo/inputvisitinfo/${appointment.appointmentid}`, {
                doctornotes: doctorNotes,
                notesforpatient: notesForPatient
            }, {
                headers: { accessToken: token }
            });
            alert("Visit info saved successfully!");
            onClose();
        } catch (err) {
            alert("Error saving visit info.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-3xl h-[90vh] overflow-y-auto rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Edit Visit Info for {appointment.patientname}</h3>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <div className="mb-4">
                            <label className="block font-medium mb-1">Doctor Notes</label>
                            <textarea
                                className="w-full border p-2 rounded"
                                value={doctorNotes}
                                onChange={(e) => setDoctorNotes(e.target.value)}
                                rows={4}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium mb-1">Notes for Patient</label>
                            <textarea
                                className="w-full border p-2 rounded"
                                value={notesForPatient}
                                onChange={(e) => setNotesForPatient(e.target.value)}
                                rows={4}
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                            <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}