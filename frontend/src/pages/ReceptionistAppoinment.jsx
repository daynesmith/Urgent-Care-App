/*import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import DoctorDropDown from '../components/DoctorDropDown'
import PatientDropDown from '../components/PatientDropDown'

const apiUrl = import.meta.env.VITE_API_URL;

export default function ReceptionistAppointment() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [doctor, setDoctor] = useState('');
  const [patient, setPatient] = useState('');
  const [error, setError] = useState('');
  const [appointmentStatus, setAppointmentStatus] = useState('');

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
    
    const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('accessToken');
    if (!token) {
        setError("No access token found. Please log in again.");
        return;
    }

    if (!date || !time || !doctor || !patient) {
        setError('Please select a doctor, patient, date, and time.');
        return;
    }
    setError('');

    console.log("Selected patient ID:", patient); 

    const formattedTime = convertTo24HourFormat(time);
    const requestedDateTime = `${date} ${formattedTime}`;

    try {
        const decoded = jwtDecode(token);
        console.log("Decoded Token:", decoded);

        if (!decoded.email) {
            setError("Invalid token structure: missing patientid.");
            return;
        }

        const appointmentData = {
            doctorid: doctor,
            patientid: patient,
            requesteddate: requestedDateTime,
            requestedtime: formattedTime,
            receptionistEmail: decoded.email, 
        };
        

        console.log('Appointment data being sent:', appointmentData);

        await axios.post(`${apiUrl}/appointments/appointments-receptionists`, appointmentData, {
            headers: { 'accessToken': token },
        });

        setAppointmentStatus('Appointment successfully created!');
    } catch (error) {
        console.error('Frontend: Error creating appointment:', error);
        setError('Failed to create appointment.');
    }
};


  return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-100">
          <div className="bg-white shadow-xl rounded-lg p-6 w-96">
              <h2 className="text-2xl font-bold text-center mb-4">Schedule Appointment</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                 
                  <div>
                      <label htmlFor="patient" className="block text-sm font-medium text-gray-700">
                          Choose a patient:
                      </label>
                      <PatientDropDown patient={patient} setPatient={setPatient} />
                  </div>

                  
                  <div>
                      <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
                          Choose a doctor:
                      </label>
                      <DoctorDropDown doctor={doctor} setDoctor={setDoctor} />
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
}*/

import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, Clock, User, Phone, FileText, Check, ChevronLeft, ChevronRight, Stethoscope } from 'lucide-react';
import { jwtDecode } from 'jwt-decode'; 
import DoctorDropDown from '../components/DoctorDropDown';
import PatientDropDown from '../components/PatientDropDown';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, isToday, parse, startOfWeek, endOfWeek } from 'date-fns';

const apiUrl = import.meta.env.VITE_API_URL;

const TIME_SLOTS = Array.from({ length: 17 }, (_, i) => {
  const hour = Math.floor(i / 2) + 9;
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

const APPOINTMENT_TYPES = ["Regular Checkup", "Follow-up", "Consultation", "Emergency"];

export default function ReceptionistAppointment() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [doctor, setDoctor] = useState('');
  const [patient, setPatient] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [appointmentStatus, setAppointmentStatus] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    phone: '', // Make sure phone is initialized
    // other fields...
  });

  const convertTo24HourFormat = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError("No access token found. Please log in again.");
      return;
    }

    const { date, time, doctor } = formData;
    if (!date || !time || !doctor) {
      setError('Please select a doctor, patient, date, and time.');
      return;
    }
    setError('');

    const formattedTime = convertTo24HourFormat(time);
    const requestedDateTime = `${date} ${formattedTime}`;

    try {
      const decoded = jwtDecode(token);
      if (!decoded.email) {
        setError("Invalid token structure: missing email.");
        return;
      }

      const appointmentData = {
        doctorid: doctor,
        patientid:patient, 
        requesteddate: requestedDateTime,
        requestedtime: formattedTime,
        receptionistEmail: decoded.email,
      };

      console.log('Appointment data being sent:', appointmentData);

      await axios.post(`${apiUrl}/appointments/appointments-receptionists`, appointmentData, {
        headers: { 'accessToken': token },
      });

      setAppointments([...appointments, { ...appointmentData, id: Date.now().toString() }]);
      setAppointmentStatus('Appointment successfully created!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Clear all fields
        setDate('');
        setTime('');
        setDoctor('');
        setPatient('');
    } catch (error) {
      console.error('Frontend: Error creating appointment:', error);
      setError('Failed to create appointment.');
    }
  };

  // Replace the handleChange since you’re no longer using formData:
const handleChange = (e) => {
    const { name, value } = e.target;
  
    switch (name) {
      case 'doctor':
        setDoctor(value);
        break;
      case 'patient':
        setPatient(value);
        break;
      case 'date':
        setDate(value);
        break;
      case 'time':
        setTime(value);
        break;
      default:
        break;
    }
  };  

    // Calendar calculations for rendering days
    const calendarDays = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentMonth));
        const end = endOfWeek(endOfMonth(currentMonth));
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);
    
    const previousMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
    };
    
    const nextMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
    };
  

    // Fetch appointments for a specific day (you can customize this to match your DB)
    const getAppointmentsForDay = (day) => {
        return appointments.filter(appointment =>
        isSameDay(parseISO(appointment.requesteddate), day)
        );
    };
    

    // When the user clicks a day on the calendar
    const handleDateClick = (selectedDay) => {
        setSelectedDate(selectedDay);
        setDate(format(selectedDay, 'yyyy-MM-dd'));
    };
  

    // Determine which time slots are already booked for a doctor on a date
    const getAvailableTimeSlots = (date, doctorId) => {
        const bookedSlots = appointments
        .filter(apt =>
            apt.requesteddate.startsWith(date) && apt.doctorid === doctorId
        )
        .map(apt => apt.requestedtime);
    
        return TIME_SLOTS.filter(slot => !bookedSlots.includes(slot));
    };
    

    // Memoized available time slots for the selected date and doctor
    const selectedDateAvailableSlots = useMemo(() => {
        if (!date || !doctor) return TIME_SLOTS;
        return getAvailableTimeSlots(date, doctor);
    }, [date, doctor, appointments]);
    
    return (
        <div className="min-h-screen bg-gray-50">

        {/*Header*/}
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Appointment Scheduler</h1>
            </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

            {/*Calendar Overview*/}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Calendar Overview</h2>
                <div className="flex space-x-2">
                    <button
                    onClick={previousMonth}
                    className="p-2 hover:bg-gray-100 rounded-full"
                    >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-full"
                    >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                </div>
                </div>
                <h3 className="text-center font-medium mb-4">
                {format(currentMonth, 'MMMM yyyy')}
                </h3>
                <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="font-medium text-gray-500">
                    {day}
                    </div>
                ))}
                </div>

            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day) => {
                    const appointmentsToday = getAppointmentsForDay(day);
                    const hasAppointments = appointmentsToday.length > 0;
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));
                    return (
                        <button
                        key={day.toString()}
                        onClick={() => !isPast && handleDateClick(day)}
                        disabled={isPast}
                        className={`
                        aspect-square p-1 relative hover:bg-gray-50 cursor-pointer
                        ${!isCurrentMonth ? 'text-gray-400' : ''}
                        ${isToday(day) ? 'bg-blue-50 font-semibold text-blue-600' : ''}
                        ${isSelected ? 'ring-2 ring-blue-500 rounded-md' : ''}
                        ${isPast ? 'cursor-not-allowed opacity-50 hover:bg-transparent' : ''}
                        ${hasAppointments && !isPast ? 'font-semibold' : ''}
                        `}
                        >
                        <time dateTime={format(day, 'yyyy-MM-dd')}>
                            {format(day, 'd')}
                        </time>
                        {hasAppointments && !isPast && (
                        <div 
                            className={`absolute bottom-1 right-1 w-2 h-2 rounded-full
                            ${isCurrentMonth ? 'bg-blue-600' : 'bg-gray-400'}
                            `}
                        />
                        )}
                        {hasAppointments && !isPast && (
                        <div className="absolute top-0 right-1 text-xs text-blue-600">
                            {appointmentsToday.length}
                        </div>
                        )}
                        </button>
                    );
                    })}
                </div>
                </div>
            </div>
            
        {/* Selected Day Appointments */}
            <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            {selectedDate ? (
                <>
                <h4 className="font-medium mb-3">
                    Appointments for {format(selectedDate, 'MMMM d, yyyy')}
                </h4>
                <div className="space-y-2">
                    {getAppointmentsForDay(selectedDate).length === 0 ? (
                    <p className="text-sm text-gray-500">No appointments scheduled</p>
                    ) : (
                    getAppointmentsForDay(selectedDate).map(apt => (
                        <div key={apt.id} className="text-sm p-2 bg-gray-50 rounded">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">{apt.time}</span>
                            <span className="text-gray-500">{apt.type}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 mt-1">
                            <User className="h-3 w-3" />
                            <span>{apt.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                            <Stethoscope className="h-3 w-3" />
                            <span>{apt.doctor}</span>
                        </div>
                        </div>
                    ))
                    )}
                </div>
                </>
            ) : (
                <p className="text-sm text-gray-500">Select a date to see appointments.</p>
            )}
            </div>
            {/* Appointment Form */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium mb-6">Schedule New Appointment</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    </label>
                    <div>
                        <label htmlFor="patient" className="block text-sm font-medium text-gray-700">
                            Choose a patient:
                        </label>
                        <PatientDropDown patient={patient} setPatient={setPatient} />
                    </div>
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                    </label>
                    <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="(123) 456-7890"
                    />
                    </div>
                </div>

                <div>
                    <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
                        Choose a doctor:
                    </label>
                    <DoctorDropDown doctor={doctor} setDoctor={setDoctor} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Appointment Type
                    </label>
                    <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {APPOINTMENT_TYPES.map(type => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                        ))}
                    </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                    </label>
                    <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={(e) => {
                            handleChange(e);
                            setDate(e.target.value);
                        }}
                        required
                        className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Time Slots
                    </label>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                    {selectedDateAvailableSlots.map((time) => (
                        <button
                        key={time}
                        type="button"
                        onClick={() => {
                            setFormData(prev => ({ ...prev, time }));
                            setTime(time); 
                        }}
                        className={`
                            py-2 px-3 text-sm rounded-md border
                            ${formData.time === time
                            ? 'bg-blue-500 text-white border-transparent'
                            : 'border-gray-300 hover:border-blue-500'
                            }
                        `}
                        >
                        {time}
                        </button>
                    ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                    </label>
                    <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Additional notes..."
                    />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    Schedule Appointment
                </button>
                </form>
                {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium mb-6">Upcoming Appointments</h2>
                <div className="space-y-4">
                {appointments.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No appointments scheduled</p>
                ) : (
                    appointments
                    .sort((a, b) => {
                        const dateA = new Date(`${a.date} ${a.time}`);
                        const dateB = new Date(`${b.date} ${b.time}`);
                        return dateA.getTime() - dateB.getTime();
                    })
                    .map(appointment => (
                        <div
                        key={appointment.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                        >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{appointment.name}</h3>
                            <span className="text-sm text-gray-500">{appointment.phone}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            <span>{appointment.date}</span>
                            <Clock className="h-4 w-4 ml-4 mr-2" />
                            <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Stethoscope className="h-4 w-4 mr-2" />
                            <span>{appointment.doctor}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {appointment.type}
                            </span>
                        </div>
                        {appointment.notes && (
                            <p className="mt-2 text-sm text-gray-600">{appointment.notes}</p>
                        )}
                        </div>
                    ))
                )}
                </div>
            </div>
            </div>        
        </main>
    </div>
    );
    };