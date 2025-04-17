import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search,
  Plus,
  MoreVertical,
  Filter,
  Download,
  Calendar,
  Phone,
  Mail,
  Clock,
  X
} from 'lucide-react';
import { format, parse } from 'date-fns';

const apiUrl = import.meta.env.VITE_API_URL;

export default function ReceptionistPatients() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [filters, setFilters] = useState({
    status: 'All',
    hasAppointment: null,
    startDate: '',
    endDate: '',
    doctor: 'All'
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${apiUrl}/appointments/getappointments`);
        setAppointments(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setError('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [currentMonth]);

  const filteredAppointments = appointments.filter(apt => {
    const patient = apt.patient || {};
    const doctor = apt.doctor || {};
  
    const matchesSearch =
      patient.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phonenumber?.includes(searchTerm);
  
    const matchesStatus =
      filters.status === 'All' || apt.appointmentstatus === filters.status;
  
    const matchesAppointment =
      filters.hasAppointment === null ||
      (filters.hasAppointment ? apt.nextAppointment !== '' : apt.nextAppointment === '');
  
    const matchesDoctor =
      filters.doctor === 'All' || doctor.firstname?.toLowerCase() === filters.doctor.toLowerCase();
  
    const matchesDateRange = () => {
      if (!filters.startDate && !filters.endDate) return true;
      const appointmentDate = new Date(apt.nextAppointment);
      const afterStart = filters.startDate ? appointmentDate >= new Date(filters.startDate) : true;
      const beforeEnd = filters.endDate ? appointmentDate <= new Date(filters.endDate) : true;
      return afterStart && beforeEnd;
    };
  
    return matchesSearch && matchesStatus && matchesAppointment && matchesDoctor && matchesDateRange();
  });
  
  // Deduplicate by patientid
  const uniquePatientsMap = new Map();
  filteredAppointments.forEach((apt) => {
    const patientid = apt.patientid;
    if (!uniquePatientsMap.has(patientid)) {
      uniquePatientsMap.set(patientid, apt);
    }
  });
  const filteredPatients = Array.from(uniquePatientsMap.values());
  
  const getLastAppointment = (appointments, patientid) => {
    const pastAppointments = appointments
      .filter((apt) => apt.patientid === patientid)
      .filter((apt) => {
        const appointmentDate = new Date(`${apt.requesteddate}T${apt.requestedtime}`);
        return appointmentDate < new Date(); // Only past appointments
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.requesteddate}T${a.requestedtime}`);
        const dateB = new Date(`${b.requesteddate}T${b.requestedtime}`);
        return dateB - dateA; // Most recent first
      });
  
    return pastAppointments[0] || null;
  };
  


  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getNextAppointment = (appointments, patientid) => {
    console.log("Appointments of patientId", patientid, ":", appointments);
    
    const now = new Date();
    console.log("Current Date:", now);
  
    const futureAppointments = appointments
      .filter((apt) => {
        // Log for debugging
        console.log("Checking appointment for patientId:", apt.patientid);
        console.log("Appointment date:", `${apt.requesteddate}T${apt.requestedtime}`);
        const appointmentDate = new Date(`${apt.requesteddate}T${apt.requestedtime}`);
        console.log("Appointment Date:", appointmentDate);
  
        // Filter future appointments
        return apt.patientid === patientid && appointmentDate > now;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.requesteddate}T${a.requestedtime}`);
        const dateB = new Date(`${b.requesteddate}T${b.requestedtime}`);
        return dateA - dateB; // Sort by the earliest date
      });
  
    console.log("Future appointments for patient:", futureAppointments);
  
    // Return the first future appointment if exists
    return futureAppointments[0] || null;
  };

    
    

  const exportPatients = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Last Visit', 'Next Appointment', 'Status'],
      ...filteredPatients.map(apt => [
        `${apt.patient?.firstname || 'N/A'} ${apt.patient?.lastname || 'N/A'}`,
        apt.patient?.email || '',
        apt.patient?.phonenumber || '',
        apt.patient?.lastVisit || '',
        apt.patient?.nextAppointment || '',
        apt.patient?.status || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patients.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };


  // Modal Component
  const Modal = ({ isOpen, closeModal, appointmentDetails, allappointments }) => {
    if (!isOpen) return null;
  
    console.log("All Appointments:", allappointments);
    console.log("Appointment Details:", appointmentDetails);
  
    const filteredAppointments = allappointments
  ?.filter((appt) => appt.patientid === appointmentDetails?.patientid)
  .sort((a, b) => {
    // First, compare dates (in descending order)
    const dateA = new Date(a.requesteddate);
    const dateB = new Date(b.requesteddate);

    // If the dates are the same, compare times (in descending order)
    if (dateA.getTime() === dateB.getTime()) {
      const timeA = parse(a.requestedtime, 'HH:mm:ss', new Date());
      const timeB = parse(b.requestedtime, 'HH:mm:ss', new Date());
      return timeB - timeA;  // Compare times in descending order (most recent first)
    }

    return dateB - dateA;  // Compare dates in descending order (most recent first)
  });

console.log("Filtered and Sorted (Descending) Appointments:", filteredAppointments);

  
    const getStatusColor = (status) => {
      if (!status) return 'bg-gray-100 text-gray-700';
      switch (status.toLowerCase()) {
        case 'completed':
          return 'bg-green-100 text-green-700';
        case 'in progress':
          return 'bg-yellow-100 text-yellow-700';
        case 'waiting':
          return 'bg-blue-100 text-blue-700';
        case 'scheduled':
          return 'bg-gray-100 text-gray-700';
        case 'cancelled':
          return 'bg-red-100 text-red-700';
        default:
          return 'bg-gray-100 text-gray-700';
      }
    };
  
    return (
      <div className="fixed top-0 left-0 bottom-0 right-0 w-full h-screen bg-gray-900 bg-opacity-40 backdrop-blur-[2px] z-50 flex items-center justify-center p-20">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
          <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-black">
            ✕
          </button>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar size={20} />
              All Appointments for {appointmentDetails?.patientName}
            </h3>
  
            <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
              {filteredAppointments?.map((appt) => (
                <div
                  key={appt.appointmentid}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    {/* Left Side Info */}
                    <div className="flex flex-col space-y-2">
                      <div className="text-sm text-gray-500">
                        Doctor: Dr. {appt.doctor?.firstname} {appt.doctor?.lastname || 'Not assigned'}
                      </div>
                      <div className="text-sm text-gray-600">
                        Date: {new Date(appt.requesteddate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        Time: {appt.requestedtime
                          ? format(parse(appt.requestedtime, 'HH:mm:ss', new Date()), 'h:mm a')
                          : 'N/A'}
                      </div>
                    </div>
  
                    {/* Right Side - Status + Edit (side by side) */}
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          appt.appointmentstatus
                        )}`}
                      >
                        {appt.appointmentstatus
                          ? appt.appointmentstatus.charAt(0).toUpperCase() + appt.appointmentstatus.slice(1)
                          : 'Unknown'}
                      </span>
                      <button
                        onClick={() => alert('Edit appointment')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
  
              {filteredAppointments?.length === 0 && (
                <p className="text-sm text-gray-500 italic">No other appointments found for this patient.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  


  return (
    <div className="bg-[#F8F9FA] shadow w-full h-screen">
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Actions Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search patients..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button
              onClick={exportPatients}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
  
        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="All">All</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Waiting">Waiting</option>
                  <option value="In progress">In progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment</label>
                <select
                  value={filters.hasAppointment === null ? 'all' : filters.hasAppointment.toString()}
                  onChange={(e) =>
                    setFilters(prev => ({
                      ...prev,
                      hasAppointment: e.target.value === 'all' ? null : e.target.value === 'true',
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="true">Has Appointment</option>
                  <option value="false">No Appointment</option>
                </select>
              </div>
            </div>
          </div>
        )}
  
        {/* Status Messages */}
        {loading ? (
          <div className="text-center text-gray-500">Loading patients...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center text-gray-500">No patients found.</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Visit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Appointment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((apt) => {
                    const nextAppointment = getNextAppointment(appointments, apt.patientid);
                    const nextAppointmentDate = nextAppointment
                    ? new Date(`${nextAppointment.requesteddate}T${nextAppointment.requestedtime}`).toLocaleDateString('en-US')
                    : null;
                    
                    const lastAppointment = getLastAppointment(appointments, apt.patientid);
                    const lastAppointmentDate = lastAppointment
                    ? new Date(`${lastAppointment.requesteddate}T${lastAppointment.requestedtime}`).toLocaleDateString('en-US')
                    : 'No previous appointment';

                    const handleModalOpen = () => {
                        setSelectedAppointment({
                            patientid: apt.patientid,
                            patientName: `${apt.patient?.firstname} ${apt.patient?.lastname}`,
                            appointmentDate: nextAppointmentDate,
                            status: apt.appointmentstatus,
                            // Add any other details you'd like to show in the modal
                        });
                        setIsModalOpen(true);
                      };

                    return (
                    <tr key={apt.appointmentid} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                            {apt.patient
                            ? `${apt.patient.firstname || 'N/A'} ${apt.patient.lastname || 'N/A'}`
                            : 'N/A'}
                        </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                            <div className="flex items-center text-sm text-gray-500">
                            <Mail className="h-4 w-4 mr-1" />
                            {apt.patient?.email || 'N/A'}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-4 w-4 mr-1" />
                            {apt.patient?.phonenumber || 'N/A'}
                            </div>
                        </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {lastAppointmentDate}
                        </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {nextAppointmentDate || 'No upcoming appointment'}
                        </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            apt.patient?.status || ''
                            )}`}
                        >
                            {apt.appointmentstatus || 'N/A'}
                        </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={handleModalOpen} className="text-gray-400 hover:text-gray-500">
                            <MoreVertical className="h-5 w-5" />
                        </button>
                        </td>
                    </tr>
                    );
                })}
                </tbody>

            </table>
          </div>
        )}
      </main>
      <Modal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        appointmentDetails={selectedAppointment}
        allappointments = {appointments}
      />
    </div>
  );
}  