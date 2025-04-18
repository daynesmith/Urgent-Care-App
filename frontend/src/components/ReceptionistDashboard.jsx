import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Link, useLocation } from 'react-router-dom';

import {
  Activity,
  Bell,
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Search,
  Plus,
  FileText,
  Stethoscope,
  Clipboard,
  ClipboardCheck,
  UserCheck,
  Clock4,
  Home,
  CalendarClock,
  Receipt,
  UserPlus,
  Settings,
  LayoutDashboard
} from 'lucide-react';

import { jwtDecode } from 'jwt-decode';
import {
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

export default function ReceptionDashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const currentDate = new Date();

  const isActive = (path) => location.pathname === path;

  const [date, setDate] = useState('');
  // Searchable Patient Dropdown Logic
  const [query, setQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [time, setTime] = useState('');
  const [doctor, setDoctor] = useState('');
  const [patient, setPatient] = useState('');
  const [allPatients, setAllPatient] = useState([]);
  const [appointmentStatus, setAppointmentStatus] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [checkedIn, setCheckedIn] = useState([]);
  const [appointmentStatuses, setAppointmentStatuses] = useState({});

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

    const todayAppointments = appointments.filter((apt) => {
      const today = new Date();
      const aptDate = new Date(`${apt.requesteddate}T${apt.requestedtime}`);
      return isSameDay(today, aptDate);
    });

    const handleCheckIn = async (appointmentid) => {
      console.log(appointmentid)
      try {
        const response = await axios.post(`${apiUrl}/appointments/updateStatus`, {
          appointmentid,
          appointmentstatus: "waiting",
        });
    
        // Update local state if needed
        setAppointmentStatuses((prev) => ({
          ...prev,
          [appointmentid]: "waiting",
        }));

        // Optional: if you're not refetching the whole list, manually update the status
      setTodayAppointments((prev) =>
        prev.map((apt) =>
          apt.appointmentid === appointmentid
            ? { ...apt, appointmentstatus: 'waiting' }
            : apt
        )
      ); 

         // After successful check-in, update local state
        setCheckedIn((prev) => ({
          ...prev,
          [appointmentid]: true, // mark this appointment as checked-in
        }));
    
        console.log("Check-in successful:", response.data);
      } catch (error) {
        console.error("Check-in error:", error);
      }
    };
    
    const isLate = (appointmentTime, status) => {
      if (status !== "scheduled" || status === "waiting") return false; // If not scheduled or is waiting, not late
    
      const now = new Date();
      const [time, modifier] = appointmentTime.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
    
      if (modifier.toUpperCase() === "PM" && hours !== 12) {
        hours += 12;
      } else if (modifier.toUpperCase() === "AM" && hours === 12) {
        hours = 0;
      }
    
      const appointmentDate = new Date();
      appointmentDate.setHours(hours, minutes, 0, 0); // Set appointment time
    
      // Check if it's 15 minutes after the scheduled time
      const lateThreshold = new Date(appointmentDate.getTime() + 15 * 60000);
    
      return now > lateThreshold; // Late if current time is more than 15 minutes after the appointment time
    };
  return (
    <div
      className="bg-[#F8F9FA] m-0 p-0 shadow rounded-lg mt-0"
      style={{
        marginTop: "0px",
        marginLeft: "0px",
        marginRight: "0px",
        marginBottom: "0px",
        paddingTop: "0px",
        paddingLeft: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
      }}
    >
      {/* Main Layout */}
      <div className="relative bg-gray-50 flex"style={{
          marginTop: "0px",
          marginRight: "0px",
          marginBottom: "0px",
          marginLeft: "0px",
          paddingLeft: "5px",
          paddingTop: "0px",
          paddingBottom: "0px",
          paddingRight: "5px",
        }}>
        
        <div className="w-61 bg-white shadow-sm">
          <nav className="p-4 space-y-2">
            <Link
              to="/ReceptionistNotification"
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg ${
                isActive('/Notification') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Notification</span>
            </Link>
            <Link
              to="/ReceptionistAppointment"
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg ${
                isActive('/Appointments') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <CalendarClock className="h-5 w-5" />
              <span>Appointments</span>
            </Link>
            <Link
              to="/ReceptionistPatients"
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg ${
                isActive('/Patients') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <UserPlus className="h-5 w-5" />
              <span>Patients</span>
            </Link>
            <Link
              to="/ReceptionistBilling"
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg ${
                isActive('/Billing') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Receipt  className="h-5 w-5" />
              <span>Billing</span>
            </Link>
            <Link
              to="/ReceptionistProfile"
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg ${
                isActive('/Settings') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>
        {/* Main Content */}
        <div className="ml-0 flex-2">
          {/* Header */}
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex justify-end items-center">
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {format(currentDate, "EEEE, MMMM d, yyyy")}
                    </div>
                    <div className="text-lg font-medium">{format(currentDate, "h:mm a")}</div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Today's Schedule */}
          <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Today's Schedule</h2>
            <div className="space-y-4">
              {todayAppointments.length === 0 ? (
                <p className="text-gray-500">No appointments scheduled for today</p>
              ) : (
                todayAppointments.map((apt) => {
                  const isCheckedIn = apt.appointmentstatus === 'waiting';

                  return (
                    <div
                      key={apt.appointmentid}
                      className="flex items-start p-4 bg-gray-100 rounded-lg"
                    >
                      {/* Time and Divider */}
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold">
                          {apt.requestedtime
                            ? format(parse(apt.requestedtime, 'HH:mm:ss', new Date()), 'h:mm a')
                            : 'Unknown Time'}
                        </span>
                        <div className="w-px h-10 bg-gray-400" />
                      </div>

                      {/* Main Content */}
                      <div className="ml-4 flex-1 flex justify-between items-center">
                        {/* Left Side: Patient & Doctor Info */}
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <Users className="h-4 w-4 mr-1" />
                            <span className="font-medium">
                              {apt.patient
                                ? `${apt.patient.firstname} ${apt.patient.lastname}`
                                : 'Unknown Patient'}
                            </span>
                            {apt.patient?.phonenumber && (
                              <div className="flex items-center text-sm text-gray-600 ml-4">
                                <Phone className="h-4 w-4 mr-1" />
                                <span>{apt.patient.phonenumber}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center text-sm text-gray-500">
                            <Stethoscope className="h-4 w-4 mr-1" />
                            {apt.doctor
                              ? `${apt.doctor.firstname} ${apt.doctor.lastname}`
                              : 'Unknown Doctor'}
                          </div>
                        </div>

                        {/* Right Side: Status & Button */}
                        <div className="flex flex-col items-end space-y-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {apt.appointmentstatus || 'Unknown'}
                          </span>
                          <button
                            className={`px-3 py-1 text-xs font-medium text-white rounded ${
                              isCheckedIn
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                            onClick={() => handleCheckIn(apt.appointmentid)}
                            disabled={isCheckedIn}
                          >
                            {isCheckedIn ? 'Checked In' : 'Check In'}
                          </button>
                        </div>
                        {isLate(apt.appointmenttime, apt.status) && (
                          <span className="text-red-500 ml-2 font-semibold">(Late)</span>
                        )}

                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>



          {/* Upcoming Appointments */}
              <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium mb-6">Upcoming Appointments</h2>
              <div className="space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto">
              {appointments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No appointments scheduled</p>
              ) : (
                appointments
                  .filter((apt) => {
                    const today = new Date();
                    const aptDateTime = new Date(`${apt.requesteddate}T${apt.requestedtime}`);
                    return aptDateTime >= today;
                  })
                  .sort((a, b) => {
                    const dateA = new Date(`${a.requesteddate}T${a.requestedtime}`);
                    const dateB = new Date(`${b.requesteddate}T${b.requestedtime}`);
                    return dateA - dateB;
                  })
                  .map((appointment) => (
                    <div
                      key={appointment.appointmentid}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-800">
                          {appointment.patient
                            ? `${appointment.patient.firstname} ${appointment.patient.lastname}`
                            : 'Unknown Patient'}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {appointment.requesteddate
                            ? format(parseISO(appointment.requesteddate), 'MMM d, yyyy')
                            : 'Unknown Date'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {appointment.requestedtime
                          ? format(parse(appointment.requestedtime, 'HH:mm:ss', new Date()), 'h:mm a')
                          : 'Unknown Time'}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                        <Stethoscope className="h-4 w-4" />
                        {appointment.doctor
                          ? `Dr. ${appointment.doctor.firstname} ${appointment.doctor.lastname}`
                          : 'Unknown Doctor'}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
