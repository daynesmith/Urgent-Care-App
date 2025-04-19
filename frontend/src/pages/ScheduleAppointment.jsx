import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import DoctorDropDown from '../components/DoctorDropDown';
import ClinicLocationDropDown from '../components/ClinicLocationDropDown';
import ProviderDropDown from '../components/ProviderDropDown';

const apiUrl = import.meta.env.VITE_API_URL;

export default function ScheduleAppointments() {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [doctor, setDoctor] = useState('');
    const [clinicLocation, setClinicLocation] = useState(''); 
    const [error, setError] = useState('');
    const [appointmentStatus, setAppointmentStatus] = useState('');
    const [selectedProvider, setSelectedProvider] = useState('');

    const availableTimes = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
        "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
        "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
        "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM",
        "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM",

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!date || !time || !doctor || !clinicLocation) {
            setError('Please select a doctor, date, time, and clinic location.');
        if (!date || !time || !selectedProvider) {
            setError('Please select a doctor, date, and time.');
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
            console.log("Decoded token in ProviderDropdown:", decoded);


            if (!decoded.email) {
                setError("Invalid token structure: missing patientid.");
                return;
            }

            const [type, id] = selectedProvider.split('-');
            const appointmentData = {
                requesteddate: date,
                requestedtime: formattedTime,
                patientEmail: decoded.email,
              };
            if (type === 'doctor') {
                appointmentData.doctorid = id;
            } 
            else if (type === 'specialist') {
                appointmentData.specialistid = id;
            }

            if (!decoded.email) {
                setError("Invalid token structure: missing patientid.");
                return;
            }
            console.log('Appointment data being sent:', appointmentData);

            await axios.post(`${apiUrl}/appointments/appointments-actions`, appointmentData, {
                headers: { 'accessToken': token },
            });

            setAppointmentStatus('Appointment successfully created!');
        } catch (error) {
            alert(error.response.data)
            console.error('Error creating appointment:', error);
            setError('Failed to create appointment.');
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    };    

    return (
        
        <div className="min-h-screen bg-white-50">
            <div className="bg-white shadow-xl rounded-lg p-6 w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Schedule Appointment</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
                            Choose a doctor:
                        </label>
                        <ProviderDropDown selected={selectedProvider} setSelected={setSelectedProvider} />
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

                    <div>
                        <label htmlFor="clinicLocation" className="block text-sm font-medium text-gray-700">
                            Select a Clinic Location:
                        </label>
                        <ClinicLocationDropDown 
                            location={clinicLocation} 
                            setLocation={setClinicLocation} 
                        />
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
