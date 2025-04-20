import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import DoctorDropDown from '../components/DoctorDropDown';

const apiUrl = import.meta.env.VITE_API_URL;

export default function ScheduleAppointments() {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [doctor, setDoctor] = useState('');
    const [error, setError] = useState('');
    const [appointmentStatus, setAppointmentStatus] = useState('');
    const [typeOfAppointment, setTypeOfAppointment] = useState([]);
    const [selectedAppointmentType, setSelectedAppointmentType] = useState('');
    const [loading, setLoading] = useState(true);

    const availableTimes = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
        "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM"
    ];

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); 
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const convertTo24HourFormat = (time12h) => {
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
    };

    useEffect(() => {
        const fetchTypeOfAppointment = async () => {
            try {
                const response = await axios.get(`${apiUrl}/inventory/getappointmenttypes`);
                setTypeOfAppointment(response.data);
            } catch (err) {
                setError('Failed to fetch appointment types.');
            } finally {
                setLoading(false);
            }
        };
        fetchTypeOfAppointment();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!date || !time || !doctor || !typeOfAppointment) {
            setError('Please fill in all fields.');
            return;
        }
        setError('');

        const formattedTime = convertTo24HourFormat(time);
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError("No access token found. Please log in again.");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            if (!decoded.email) {
                setError("Invalid token structure: missing patient email.");
                return;
            }

            const appointmentData = {
                requesteddate: date,
                requestedtime: formattedTime,
                doctorid: doctor,
                patientEmail: decoded.email,
                appointmenttype: selectedAppointmentType
            };

            await axios.post(`${apiUrl}/appointments/appointments-actions`, appointmentData, {
                headers: { 'accessToken': token },
            });

            setAppointmentStatus('Appointment successfully created!');
        } catch (error) {
            console.error('Error creating appointment:', error);
            setError(error?.response?.data || 'Failed to create appointment.');
        }
    };

    return (
        <div className="min-h-screen bg-white-50">
            <div className="bg-white shadow-xl rounded-lg p-6 w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Schedule Appointment</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
                            Choose a doctor:
                        </label>
                        <DoctorDropDown doctor={doctor} setDoctor={setDoctor} />
                    </div>

                    <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                        Choose an appointment:
                    </label>
                    <select
                        id="type"
                        value={selectedAppointmentType}
                        onChange={(e) => setSelectedAppointmentType(e.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    >
                        <option value="">Select an appointment</option>
                        {typeOfAppointment.map((item) => (
                        <option key={item.inventoryid} value={item.itemname}>
                            {item.itemname}
                        </option>
                        ))}
                    </select>
                    </div>


                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                            Select Date:
                        </label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={getTodayDate()} 
                            className="mt-1 w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                            Select Time:
                        </label>
                        <select
                            id="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="mt-1 w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="">Select a time</option>
                            {availableTimes.map((t, index) => (
                                <option key={index} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {appointmentStatus && <div className="text-green-500 text-sm">{appointmentStatus}</div>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
                    >
                        Create Appointment
                    </button>
                </form>
            </div>
        </div>
    );
}
