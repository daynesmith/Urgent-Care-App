import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import DoctorDropDown from '../components/DoctorDropDown';
import ClinicLocationDropDown from '../components/ClinicLocationDropDown';
import SpecialistDropDown from '../components/SpecialistDropDown';
import ScheduleAppointmentCalendar from '../components/ScheduleAppointmentCalendar';

const apiUrl = import.meta.env.VITE_API_URL;

export default function ScheduleAppointments() {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [doctor, setDoctor] = useState('');
    const [clinicLocation, setClinicLocation] = useState('');
    const [selectedSpecialist, setSelectedSpecialist] = useState('');
    const [error, setError] = useState('');
    const [appointmentStatus, setAppointmentStatus] = useState('');
    const navigate = useNavigate();
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

        if (!date || !time || !clinicLocation || !typeOfAppointment || (!doctor && !selectedSpecialist)) {
            setError('Please select a date, time, clinic location, appointment type, and either a doctor or a specialist.');
            return;
        }

        if (doctor && selectedSpecialist) {
            setError('You can only select either a doctor or a specialist, not both.');
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
                setError("Invalid token structure: missing email.");
                return;
            }

            const appointmentData = {
                requesteddate: date,
                requestedtime: formattedTime,
                appointmenttype: selectedAppointmentType,
                cliniclocation: clinicLocation,
            };

            if (doctor) {
                appointmentData.doctorid = doctor;

                console.log('Doctor Appointment data being sent:', appointmentData);

                await axios.post(`${apiUrl}/appointments/appointments-actions`, appointmentData, {
                    headers: { 'accessToken': token },
                });

                setAppointmentStatus('Doctor appointment successfully created!');
            } else if (selectedSpecialist) {
                appointmentData.specialistid = selectedSpecialist;

                console.log('Specialist Appointment data being sent:', appointmentData);

                await axios.post(`${apiUrl}/appointments/createAppointmentsSpecialists`, appointmentData, {
                    headers: { 'accessToken': token },
                });

                setAppointmentStatus('Specialist appointment successfully created!');
            }

            setTimeout(() => {
                setAppointmentStatus('');
            }, 3000);
        } catch (error) {
            console.error('Error creating appointment:', error);
            setError('Failed to create appointment. Doctor or Specialist not available at this time or location');
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="relative flex flex-col md:flex-row gap-8 bg-white shadow-2xl rounded-lg p-8 w-full max-w-6xl">
                {/* Close Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="w-full md:w-1/2">
                    <h2 className="text-4xl font-bold text-center mb-6">Schedule Appointment</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="doctor" className="block text-lg font-medium text-gray-700">
                                Choose a Doctor:
                            </label>
                            <DoctorDropDown
                                doctor={doctor}
                                setDoctor={(value) => {
                                    setDoctor(value);
                                    setSelectedSpecialist('');
                                }}
                            />
                        </div>

                        <div>
                            <label htmlFor="specialist" className="block text-lg font-medium text-gray-700">
                                Choose a Specialist:
                            </label>
                            <SpecialistDropDown
                                selected={selectedSpecialist}
                                setSelected={(value) => {
                                    setSelectedSpecialist(value);
                                    setDoctor('');
                                }}
                            />
                        </div>

                        <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                            Choose an appointment type:
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
                            <label htmlFor="date" className="block text-lg font-medium text-gray-700">
                                Select Date:
                            </label>
                            <input
                                type="date"
                                id="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                min={getTodayDate()}
                                className="mt-1 w-full border border-gray-300 rounded-md p-3"
                            />
                        </div>

                        <div>
                            <label htmlFor="time" className="block text-lg font-medium text-gray-700">
                                Select Time:
                            </label>
                            <select
                                id="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="mt-1 w-full border border-gray-300 rounded-md p-3"
                            >
                                <option value="">Select a time</option>
                                {availableTimes.map((t, index) => (
                                    <option key={index} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="clinicLocation" className="block text-lg font-medium text-gray-700">
                                Select a Clinic Location:
                            </label>
                            <ClinicLocationDropDown
                                location={clinicLocation}
                                setLocation={setClinicLocation}
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-center font-medium text-lg">{error}</div>
                        )}
                        {appointmentStatus && (
                            <div className="text-green-500 text-center font-medium text-lg">{appointmentStatus}</div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition"
                        >
                            Create Appointment
                        </button>
                    </form>
                </div>

                {/* Schedule Appointment Calendar */}
                {(doctor || selectedSpecialist) && (
                    <div className="w-full md:w-1/2">
                        <h2 className="text-3xl font-bold text-center mb-6">Availability</h2>
                        <ScheduleAppointmentCalendar selectedStaffId={doctor || selectedSpecialist} />
                    </div>
                )}
            </div>
        </div>
    );
}