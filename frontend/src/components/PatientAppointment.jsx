import React, { useState } from 'react';

export default function AppointmentForm() {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [doctor, setDoctor] = useState('');
    const [error, setError] = useState('');
    const [appointmentStatus, setAppointmentStatus] = useState('');

    const availableTimes = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
        "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM"
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!date || !time || !doctor) {
            setError('Please select a doctor, date, and time.');
            return;
        }
        setError('');
        setAppointmentStatus('Appointment successfully submitted!');
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-100">
            <div className="bg-white shadow-xl rounded-lg p-6 w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Schedule Appointment</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/*Choose Doctor*/}
                    <div>
                        <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">Choose a doctor:</label>
                        <select
                            id="doctor"
                            value={doctor}
                            onChange={(e) => setDoctor(e.target.value)}
                            className="mt-1 w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="">Select a doctor</option>

                            <option value="Dr. Charlie">Dr. Charlie</option>
                            <option value="Dr. Sylvia">Dr. Sylvia</option>
                            <option value="Dr. Karen">Dr. Karen</option>
                            <option value="Dr. Dayne">Dr. Dayne</option>
                            <option value="Dr. Billy">Dr. Billy</option>
                        </select>
                    </div>

                    {/*Choose Date*/}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Select Date:</label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="mt-1 w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    {/*Choose Time*/}
                    <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700">Select Time:</label>
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

                    {/*Errors and stuff*/}
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {appointmentStatus && <div className="text-green-500 text-sm">{appointmentStatus}</div>}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
                    >
                        Submit Appointment
                    </button>
                </form>
            </div>
        </div>
    );
}
