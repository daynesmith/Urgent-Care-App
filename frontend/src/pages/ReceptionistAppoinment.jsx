import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  FileText,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Stethoscope
} from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import PatientDropDown from '../components/PatientDropDown'
import DoctorDropDown from '../components/DoctorDropDown';
import {
  format,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
  parseISO,
  parse,
  isToday,
  addDays,
  startOfWeek,
  endOfWeek
} from 'date-fns';


const apiUrl = import.meta.env.VITE_API_URL;

export default function ReceptionistAppointment() {
    const [date, setDate] = useState('');
    // Searchable Patient Dropdown Logic
    const [query, setQuery] = useState('');
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [time, setTime] = useState('');
    const [doctor, setDoctor] = useState('');
    const [patient, setPatient] = useState('');
    const [allPatients, setAllPatient] = useState([]);
    const [appointmentStatus, setAppointmentStatus] = useState('');
    const [typeOfAppointment, setTypeOfAppointment] = useState([]);
    const [selectedAppointmentType, setSelectedAppointmentType] = useState('');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        doctorid: '',
        patientid: '',
        date: '',
        time: ''
    });
    {/*Viewing Appoinments*/}
  // Generate calendar days for the month
  const startDate = startOfWeek(startOfMonth(currentMonth));
  const endDate = endOfWeek(endOfMonth(currentMonth));

  const calendarDays = [];
  let currentDay = startDate;
  while (currentDay <= endDate) {
    calendarDays.push(currentDay);
    currentDay = addDays(currentDay, 1);
  }

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${apiUrl}/appointments/getappointments`);
        setAppointments(response.data);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setError('Failed to load appointments');
      }
    };
    fetchAppointments();
  }, [currentMonth]);

  
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


  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  const previousMonth = () => {
    setCurrentMonth(prev => addDays(prev, -30));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => addDays(prev, 30));
  };

  const getAppointmentsForDay = (day) => {
    return appointments.filter((appointment) => {
      if (!appointment.requesteddate) return false;
      const appointmentDate = parseISO(appointment.requesteddate);
      return isSameDay(appointmentDate, day);
    });
  };

  {/*Form Appoinments*/}

    
  const getAvailableTimeSlots = (date, doctorid) => {

    const availableTimes = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
        "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM"
    ];
  

    const TIME_SLOTS = [
      "09:00:00", "09:30:00", "10:00:00", "10:30:00",
      "11:00:00", "11:30:00", "12:00:00", "12:30:00",
      "13:00:00", "13:30:00", "14:00:00", "14:30:00",
      "15:00:00", "15:30:00"
    ];
    
    // Function to convert a time string in HH:mm format to 12-hour AM/PM format
    const convertTo12HourFormat = (time) => {
        const timeParsed = parse(time, 'HH:mm:ss', new Date()); // Parse the time in 24-hour format
        return format(timeParsed, 'hh:mm a'); // Convert to 12-hour format
    };

    if (!date || !doctorid) return availableTimes;
  
    // 1. Filter appointments matching selected date & doctor
    const bookedTimes = appointments
      .filter(apt => {
        if (!apt.requesteddate || !apt.doctorid || !apt.requestedtime) return false;
  
        const aptDate = new Date(apt.requesteddate).toDateString();
        const selectedDate = new Date(date).toDateString();
  
        return aptDate === selectedDate && String(apt.doctorid) === String(doctorid);
      })
      .map(apt => apt.requestedtime); // 2. Get only requested times
  
    console.log("Booked Times:", bookedTimes);
  
    // 3. Filter out booked times
    const availableSlots = TIME_SLOTS.filter(slot => !bookedTimes.includes(slot));
  
    //Changing the availableSlots to AM/PM
    const availableSlotsIn12HrFormat = availableSlots
    .map(convertTo12HourFormat);  // Convert the available slots into AM/PM format

    console.log("Available Slots (AM/PM):", availableSlotsIn12HrFormat);  // Log the available time slots in AM/PM format

    return availableSlotsIn12HrFormat; 
  };
  

    // Use memoization to avoid recalculating available slots unnecessarily
    const availableSlots = useMemo(() => {
        return getAvailableTimeSlots(formData.date, formData.doctorid);
    }, [formData.date, formData.doctorid, appointments]); // Dependencies for memoization

    const convertTo24HourFormat = (time12h) => {
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
      
        if (hours === '12') {
          hours = '00';
        }
      
        if (modifier.toUpperCase() === 'PM') {
          hours = String(parseInt(hours, 10) + 12);
        }
      
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
      };
     
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError("No access token found. Please log in again.");
          return;
        }
      
        let decoded;
        try {
          decoded = jwtDecode(token);
        } catch (err) {
          setError("Invalid token.");
          return;
        }
      
        if (!formData.date || !formData.time || !formData.doctorid || !patient || !selectedAppointmentType ) {
          setError('Please select a doctor, patient, date, and time.');
          return;
        }
      
        const formattedTime = convertTo24HourFormat(formData.time);
      
        // Prepare appointment data
        const appointmentData = {
          doctorid: formData.doctorid,
          patientid: patient,
          requesteddate: formData.date,
          requestedtime: formattedTime,
          receptionistEmail: decoded.email,
          appointmenttype: selectedAppointmentType
        };
      
        // Log info
        console.log("Appointment Data:", appointmentData);
      
        try {
          await axios.post(`${apiUrl}/appointments/appointments-receptionists`, appointmentData, {
            headers: { 'accessToken': token },
          });
      
          setAppointmentStatus('Appointment successfully created!');
        } catch (error) {
          console.error('Frontend: Error creating appointment:', error);
          setError('Failed to create appointment.');
        }
      };
      
      
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      };  
      
      useEffect(() => {
        console.log("Available Slots Updated:", availableSlots);
      }, [availableSlots]);
      
      

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:px-2 lg:px-8"
    style={{
      paddingTop: '10px',
      paddingLeft: '10px',
      paddingRight: '10px',
      paddingBottom: '10px',
    }}>
      <div className="grid grid-cols-2 gap-8 lg:grid-cols-2">
        {/* Calendar Overview */}
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
                key={day.toISOString()}
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
                style={{
                    paddingTop: '8px',
                    paddingRight: '8px',
                    paddingBottom: '8px',
                }}
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
    {/* Selected Day Appointments */}
    {selectedDate && (
    <div className="mt-6 border-t pt-4">
    <h4 className="flex items-center justify-center text-gray-900 font-medium mb-3">
      Appointments for {format(selectedDate, 'MMMM d, yyyy')}
    </h4>
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-10">
    {getAppointmentsForDay(selectedDate).length === 0 ? (
      <p className="text-sm text-gray-500">No appointments scheduled</p>
    ) : (
        <table className="min-w-full divide-y divide-gray-200 text-sm bg-white shadow rounded">
          <thead className="text-sm p-4 bg-gray-50 text-gray-600 rounded-md border border-gray-200 shadow-sm">
            {getAppointmentsForDay(selectedDate)
            .sort((a, b) => {
                const timeA = parse(a.requestedtime, 'HH:mm:ss', new Date());
                const timeB = parse(b.requestedtime, 'HH:mm:ss', new Date());
                return timeA - timeB;
            })
            .map((apt) => (
              <tr key={apt.appointmentid} className="text-sm p-4 bg-gray-50 text-gray-600 rounded-md border border-gray-200 shadow-sm">
              <td className="px-4 py-2">
                {apt.requestedtime
                    ? format(parse(apt.requestedtime, 'HH:mm:ss', new Date()), 'h:mm a')
                    : 'N/A'}
                </td>
                <td className="px-4 py-2 flex items-center gap-1 text-gray-600">
                  <User className="h-4 w-4" />
                  {apt.patient
                    ? `${apt.patient.firstname} ${apt.patient.lastname}`
                    : 'N/A'}
                </td>
                <td className="px-4 py-2 flex items-center gap-1 text-gray-600">
                  <Stethoscope className="h-4 w-4" />
                  {apt.doctor
                    ? `Dr. ${apt.doctor.firstname} ${apt.doctor.lastname}`
                    : 'N/A'}
                </td>
              </tr>
            ))}
            </thead>
            </table>
        )}
        </div>
        </div>
        )}
    </div>

    
    {/* Appointment Form */}
    <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-6">Schedule New Appointment</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
            <label htmlFor="patient" className="block text-sm font-medium text-gray-700">
                Choose a patient:
            </label>
            <PatientDropDown
                patient={patient}
                setPatient={(selectedPatient) => {
                    setPatient(selectedPatient);
                    setFormData(prev => ({
                    ...prev,
                    patientid: selectedPatient?.patientid || ''
                    }));
                }}
                />

            </div>
        
              <div>
                <div>
                    <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
                        Choose a doctor:
                    </label>
                    <DoctorDropDown
                    doctor={doctor}
                    setDoctor={(selectedDoctor) => {
                        console.log("Selected Doctor:", selectedDoctor); // should show something like: 13
                        setDoctor(selectedDoctor);
                        setFormData(prev => ({
                        ...prev,
                        doctorid: selectedDoctor || '' // no .doctorid needed!
                        }));
                    }}
                    />
                </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    required
                    className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Time Slots
                </label>
                {console.log("Doctor: ", formData.doctorid)}
                {console.log("Date: ", formData.date)}
                {console.log("Available Slots:", getAvailableTimeSlots(formData.date, formData.doctorid))}

                <div>
                    
                {availableSlots.length > 0 ? (
                    availableSlots.map((slot) => (
                        <button
                        key={slot}
                        type="button"
                        onClick={() => setFormData({ ...formData, time: slot })}
                        className={`py-2 px-3 text-sm rounded-md border transition
                        ${formData.time === slot ? 'bg-blue-500 text-white' : 'border-gray-300'}`}
                        style={{
                            marginTop: '5px',
                            marginRight: '5px',
                            marginLeft: '5px',
                            marginBottom: '5px',
                            paddingRight: '20px',
                            paddingLeft: '20px'
                        }}
                    >
                    
                        {slot}
                    </button>
                    ))
                ) : (
                    <p>No available slots for this date and doctor.</p>
                )}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Schedule Appointment
              </button>
            </form>
            {/* Success Message */}
                {/* Error Message */}
                {error && (
                <div className="flex items-center text-red-600 text-sm mt-2 bg-red-50 p-3 rounded-md">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    {error}
                </div>
                )}

                {/* Success Message */}
                {appointmentStatus && (
                <div className="flex items-center text-green-700 text-sm mt-2 bg-green-50 p-3 rounded-md">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    {appointmentStatus}
                </div>
                )}
            </div>
    </div>
    </main>
  );
}


 