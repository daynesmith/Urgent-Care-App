import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const apiUrl = import.meta.env.VITE_API_URL;

export default function DoctorAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); //asc or desc
    const [filterType, setFilterType] = useState('all'); //'all','past', or 'future'
    const [error, setError] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const fetchAppointments = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('No access token found. Please log in again.');
            return;
        }

       //RESET ERROR STATE BEFOR EAPI CALL!!!
        setError('');

        try {
            const decoded = jwtDecode(token);
            console.log("Decoded Token:", decoded);
            if (!decoded.email) {
                setError("Invalid token structure: missing email.");
                return;
            }

            const params = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const response = await axios.get(`${apiUrl}/doctor/doctorappointmentsdaterange`, {
                headers: { 'accessToken': token },
                params: Object.keys(params).length > 0 ? params : undefined
            });

            console.log("Appointments from API:", response.data.appointments);

            setAppointments(response.data.appointments || []);
            setFilteredAppointments(response.data.appointments || []); 
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError('Failed to fetch appointments.');
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [startDate, endDate]);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = appointments.filter((appointment) =>
            appointment.patientname.toLowerCase().includes(term)
        );
        setFilteredAppointments(filtered);
    };

    const handleSortByDate = () => {
        const sorted = [...filteredAppointments].sort((a, b) => {
            const dateA = new Date(a.requesteddate);
            const dateB = new Date(b.requesteddate);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        setFilteredAppointments(sorted);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); 
    };

    const handleFilterByType = (type) => {
        setFilterType(type);

        const now = new Date();
        let filtered;

        if (type === 'past') {
            filtered = appointments.filter((appointment) => new Date(appointment.requesteddate) < now);
        } else if (type === 'future') {
            filtered = appointments.filter((appointment) => new Date(appointment.requesteddate) >= now);
        } else {
            filtered = appointments; 
        }

        setFilteredAppointments(filtered);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-center mb-4">Doctor Appointments</h2>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

            <div className="mb-4">
                <label htmlFor="search" className="block mb-2">Search by Patient Name</label>
                <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Enter patient name"
                    className="border p-2 rounded w-full"
                />
            </div>

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

            {/* sort/filter buttons1 */}
            <div className="flex space-x-4 mb-4">
                <button
                    onClick={handleSortByDate}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Sort by Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                </button>
                <button
                    onClick={() => handleFilterByType('past')}
                    className={`px-4 py-2 rounded ${filterType === 'past' ? 'bg-gray-700 text-white' : 'bg-gray-300'}`}
                >
                    Show Past Appointments
                </button>
                <button
                    onClick={() => handleFilterByType('future')}
                    className={`px-4 py-2 rounded ${filterType === 'future' ? 'bg-gray-700 text-white' : 'bg-gray-300'}`}
                >
                    Show Future Appointments
                </button>
                <button
                    onClick={() => handleFilterByType('all')}
                    className={`px-4 py-2 rounded ${filterType === 'all' ? 'bg-gray-700 text-white' : 'bg-gray-300'}`}
                >
                    Show All Appointments
                </button>
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
                        {filteredAppointments.length > 0 ? (
                            filteredAppointments.map((appointment) => (
                                <tr key={appointment.appointmentid} className="text-center border border-gray-300">
                                    <td className="border border-gray-300 p-2">{appointment.patientname}</td>
                                    <td className="border border-gray-300 p-2">{appointment.requesteddate}</td>
                                    <td className="border border-gray-300 p-2">{appointment.requestedtime}</td>
                                    <td className="border border-gray-300 p-2">{appointment.appointmentstatus}</td>
                                    <td className="border border-gray-300 p-2">{appointment.recommendedspecialist || 'N/A'}</td>

                                    <td className="border border-gray-300 p-2">
                                        <button
                                            onClick={() => setSelectedAppointment(appointment)}
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

            {selectedAppointment && (
                <VisitInfoModal
                    appointment={selectedAppointment}
                    onClose={() => setSelectedAppointment(null)}
                />
            )}
        </div>
    );
}

function VisitInfoModal({ appointment, onClose }) {
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
                const visitInfo = res.data.visitInfo;
                setDoctorNotes(visitInfo?.doctornotes || '');
                setNotesForPatient(visitInfo?.notesforpatient || '');
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