import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Link, useLocation } from 'react-router-dom';
import {
  Clock,
  MessageSquare,
  FileText,
  UserPlus,
  Settings,
  ArrowRight,
} from 'lucide-react';

import { parse,parseISO, isSameDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays } from 'date-fns';

const apiUrl = import.meta.env.VITE_API_URL;

export default function NurseDashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  const [appointments, setAppointments] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [error, setError] = useState(null);
  const location = useLocation();
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const currentDate = new Date();
  const [open, setOpen] = useState(false)
  const [selectedVisitId, setSelectedVisitId] = useState(null)
  const [selectedVisitDetails, setSelectedVisitDetails] = useState(null)

  const handleOpenDetails = (appointment) => {
    setSelectedVisitId(appointment.appointmentid)
    setSelectedVisitDetails(appointment) // or fetch more info here if needed
    setOpen(true)
  }

  const isActive = (path) => location.pathname === path;

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
        const filtered = response.data.filter(apt => {
          const aptDate = parseISO(apt.requesteddate);
          return isSameDay(aptDate, currentDate) && ["waiting", "in progress", "completed"].includes(apt.appointmentstatus);
        });
        setAppointments(filtered);
        console.log(filtered)
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setError('Failed to load appointments');
      }
    };
    fetchAppointments();
  }, [currentMonth]);


  const filteredAppointments = selectedDoctor
    ? appointments.filter(
        (appointment) => appointment.doctor?.lastname === selectedDoctor
      )
    : appointments;


  return (
    <div className="bg-[#F8F9FA] m-0 p-0 shadow rounded-lg mt-0">
      <div className="relative bg-gray-50 flex" style={{ paddingLeft: '5px', paddingRight: '5px' }}>
        <div className="w-61 bg-white shadow-sm">
          <nav className="p-4 space-y-2">
            <Link to="/ReceptionistNotification" className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg ${isActive('/Notification') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              <MessageSquare className="h-5 w-5" />
              <span>Notification</span>
            </Link>
            <Link to="/NurseDocumentation" className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg ${isActive('/Documentation') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              <FileText className="h-5 w-5" />
              <span>Documentation</span>
            </Link>
            <Link to="/NursePatients" className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg ${isActive('/Patients') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              <UserPlus className="h-5 w-5" />
              <span>Patients</span>
            </Link>
            <Link to="/NurseProfile" className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg ${isActive('/Settings') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        <div className="ml-0 flex-2">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex justify-end items-center">
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{format(currentDate, "EEEE, MMMM d, yyyy")}</div>
                    <div className="text-lg font-medium">{format(currentDate, "h:mm a")}</div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="rounded-lg border bg-white shadow-sm col-span-4">
            <div className="border-b px-4 py-3 flex flex-row items-center">
              <div className="grid gap-1">
                <h2 className="text-lg font-semibold">Today's Appointments</h2>
                <p className="text-sm text-gray-500">You have {appointments.length} appointments scheduled for today</p>
              </div>
              <Link to="/appointments" className="ml-auto inline-flex items-center gap-1 text-sm bg-gray-900 text-white px-3 py-1 rounded hover:bg-gray-600">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
                </div>
                <div className="px-4 py-3 space-y-4">
                <select
                    className="border p-2 rounded mb-4"
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                    <option value="">All Doctors</option>
                    {[...new Set(appointments.map(a => a.doctor?.lastname).filter(Boolean))].map(doctor => (
                    <option key={doctor} value={doctor}>{doctor}</option>
                    ))}
                </select>

                {filteredAppointments.map((appointment) => (
                    <div key={appointment.appointmentid} className="flex items-center justify-between space-x-4 rounded-md border p-4">
                  <div className="flex items-center space-x-4"> 
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                      <Clock className="h-5 w-5 text-teal-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{appointment.patient ? `${appointment.patient.firstname} ${appointment.patient.lastname}` : 'Unknown Patient'}</p>
                      <p className="text-sm text-gray-500">
                        {appointment.requestedtime ? format(parse(appointment.requestedtime, 'HH:mm:ss', new Date()), 'h:mm a') : 'Unknown Time'}  • Dr. {appointment.doctor ? `${appointment.doctor.lastname}` : 'Unknown Doctor'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm px-2 py-1 rounded ${appointment.appointmentstatus === "completed" ? "text-green-600 border border-green-500" : appointment.appointmentstatus === "in progress" ? "bg-teal-500 text-white" : "bg-gray-200 text-gray-700"}`}>
                      {appointment.appointmentstatus}
                    </span>
                    <Link to={`/patients/${appointment.appointmentid}`} className="text-gray-900 hover:underline">
                    <ArrowRight className="h-4 w-4" />
                    </Link>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

