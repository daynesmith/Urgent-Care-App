import { useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ClinicLocationDropDown from '../components/ClinicLocationDropDown';
import ProviderDropDown from '../components/ProviderDropDown';
const apiUrl = import.meta.env.VITE_API_URL;

export default function SingleAppointment(props) {
    const { apptid } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [appointment, setAppointment] = useState(null);
    const [date, setDate] = useState(null);
    const [time, setTime] = useState();
    const [clinicLocation, setClinicLocation] = useState('');
    const availableTimes = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
        "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM"
    ];

    const [showForm, setShowForm] = useState(false);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [newClinicLocation, setNewClinicLocation] = useState('');

    useEffect(() => {
        const fetchAppointment = async () => {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                setError("No access token found. Please log in again.");
                return;
            }
            try {
                const response = await axios.get(`${apiUrl}/appointments/appointment/${apptid}`, {
                    headers: {
                        'accessToken': token
                    }
                });
                setAppointment(response.data);
                const [year, month, day] = response.data.requesteddate.split("-");

                const formattedDate = `${month}/${day}/${year}`;
                const formattedTime = new Date(`1970-01-01T${response.data.requestedtime}`).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                });

                setDate(formattedDate);
                setTime(formattedTime);
                setClinicLocation(response.data.cliniclocation);
                setNewClinicLocation(response.data.cliniclocation);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointment();
    }, [apptid]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        if (error.includes("404")) {
            return <div>You do not have an appointment</div>;
        }
        return <div>Error: {error}</div>;
    }

    const handleCancelAppointment = async () => {
        const token = localStorage.getItem('accessToken');

        try {
            await axios.delete(`${apiUrl}/appointments/cancel-appointment/${apptid}`, {
                headers: {
                    'accessToken': token,
                },
                timeout: 5000
            });

            navigate('/visits');
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    const handleReschedule = async () => {
        const token = localStorage.getItem('accessToken');

        console.log("Reschedule request data:", {
            requesteddate: newDate,
            requestedtime: newTime,
            cliniclocation: newClinicLocation,
        });

        try {
            const response = await axios.patch(
                `${apiUrl}/appointments/reschedule-appointment/${apptid}`,
                {
                    requesteddate: newDate,
                    requestedtime: newTime,
                    cliniclocation: newClinicLocation,
                },
                {
                    headers: { accessToken: token },
                }
            );

            console.log("Appointment rescheduled:", response.data);
            alert("Appointment successfully rescheduled!");
            navigate('/visits');
        } catch (error) {
            alert(error.response.data);
            console.error("Error:", error);
        }
    };

    return (
        <>
            {!showForm ? (
                <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg relative">
                    <button
                        onClick={() => navigate(-1)} 
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                    >
                        ✕
                    </button>

                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Appointment Details</h2>
                    <div className="space-y-2">
                        <p><span className="font-medium">Date:</span> {date}</p>
                        <p><span className="font-medium">Time:</span> {time}</p>
                        <p><span className="font-medium">Clinic Location:</span> {clinicLocation}</p>
                        <p><span className="font-medium">Status:</span> {appointment.appointmentstatus}</p>
                        {appointment.appointmentstatus === "scheduled" && (
                            <div>
                                <button onClick={handleCancelAppointment} className="outline p-1 cursor-pointer bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Cancel Appointment Appointment</button>
                                <button onClick={() => setShowForm(true)} className="outline p-1 cursor-pointer bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Reschedule</button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg relative">
                    <button
                        onClick={() => setShowForm(false)}
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                    >
                        ✕
                    </button>

                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Rescheduling {date} appointment</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">New Date:</label>
                            <input
                                type="date"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                                Select Time:
                            </label>
                            <select
                                id="time"
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                            >
                                <option value="">Select a time</option>
                                {availableTimes.map((t, index) => (
                                    <option key={index} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="clinicLocation" className="block text-sm font-medium text-gray-700">
                                Select Clinic Location:
                            </label>
                            <ClinicLocationDropDown
                                location={newClinicLocation}
                                setLocation={setNewClinicLocation}
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={handleReschedule}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-600 hover:underline"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}