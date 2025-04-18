import React, { useState, Fragment, useEffect } from 'react';

import { format, isWithinInterval, startOfDay, endOfDay, parseISO } from 'date-fns';
import {
  Search,
  Filter,
  Edit2,
  Trash2,
  ChevronDown,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  AlertCircle,
  UserCircle,
} from 'lucide-react';
import { Dialog } from '@headlessui/react';

import {  Transition } from '@headlessui/react';
import { TransitionChild } from '@headlessui/react';
//npm install @headlessui/react

const doctors = [
  { id: 'd1', name: 'Dr. Sarah Johnson', specialty: 'General Practice' },
  { id: 'd2', name: 'Dr. Michael Chen', specialty: 'Pediatrics' },
  { id: 'd3', name: 'Dr. Emily Williams', specialty: 'Cardiology' },
];

const initialPatients = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    appointments: [
      {
        id: 'a1',
        date: '2025-03-15',
        time: '09:00',
        reason: 'Annual checkup',
        status: 'scheduled',
        isNewPatient: false,
        doctorId: 'd1',
      },
      {
        id: 'a2',
        date: '2025-03-20',
        time: '14:30',
        reason: 'Follow-up',
        status: 'scheduled',
        isNewPatient: false,
        doctorId: 'd2',
      },
    ],
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    appointments: [
      {
        id: 'a3',
        date: '2025-03-16',
        time: '11:00',
        reason: 'Consultation',
        status: 'scheduled',
        isNewPatient: true,
        doctorId: 'd3',
      },
    ],
  },
];

export default function ReceptionistPatients() {
  const [patients, setPatients] = useState(initialPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [showTodayOnly, setShowTodayOnly] = useState(false);

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase());

    const filteredAppointments = patient.appointments.filter((appointment) => {
      const appointmentDate = parseISO(appointment.date);
      const today = new Date();

      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;

      let withinDateRange = true;
      if (startDate && endDate) {
        withinDateRange = isWithinInterval(appointmentDate, {
          start: startOfDay(parseISO(startDate)),
          end: endOfDay(parseISO(endDate)),
        });
      }

      const matchesToday = !showTodayOnly || (
        appointmentDate.getDate() === today.getDate() &&
        appointmentDate.getMonth() === today.getMonth() &&
        appointmentDate.getFullYear() === today.getFullYear()
      );

      const matchesDoctor = selectedDoctor === 'all' || appointment.doctorId === selectedDoctor;

      return matchesStatus && withinDateRange && matchesToday && matchesDoctor;
    });

    return matchesSearch && filteredAppointments.length > 0;
  }).map(patient => ({
    ...patient,
    appointments: patient.appointments.filter(appointment => {
      const appointmentDate = parseISO(appointment.date);
      const today = new Date();

      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;

      let withinDateRange = true;
      if (startDate && endDate) {
        withinDateRange = isWithinInterval(appointmentDate, {
          start: startOfDay(parseISO(startDate)),
          end: endOfDay(parseISO(endDate)),
        });
      }

      const matchesToday = !showTodayOnly || (
        appointmentDate.getDate() === today.getDate() &&
        appointmentDate.getMonth() === today.getMonth() &&
        appointmentDate.getFullYear() === today.getFullYear()
      );

      const matchesDoctor = selectedDoctor === 'all' || appointment.doctorId === selectedDoctor;

      return matchesStatus && withinDateRange && matchesToday && matchesDoctor;
    })
  }));

  const handleEditAppointment = (patient, appointment) => {
    setSelectedPatient(patient);
    setEditingAppointment({ ...appointment });
    setIsEditModalOpen(true);
  };

  const handleSaveAppointment = () => {
    if (!selectedPatient || !editingAppointment) return;

    setPatients((prevPatients) =>
      prevPatients.map((patient) => {
        if (patient.id === selectedPatient.id) {
          return {
            ...patient,
            appointments: patient.appointments.map((apt) =>
              apt.id === editingAppointment.id ? editingAppointment : apt
            ),
          };
        }
        return patient;
      })
    );

    setIsEditModalOpen(false);
    setSelectedPatient(null);
    setEditingAppointment(null);
  };

  const handleDeleteAppointment = (patientId, appointmentId) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      setPatients((prevPatients) =>
        prevPatients.map((patient) => {
          if (patient.id === patientId) {
            return {
              ...patient,
              appointments: patient.appointments.filter((apt) => apt.id !== appointmentId),
            };
          }
          return patient;
        })
      );
    }
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  };

  return (
    <div className=" bg-gray-50">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search and Status Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 h-5 w-5" />
              <select
                className="rounded-lg border border-gray-300 py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Date Range and Doctor Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-300 py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-300 py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
              <select
                className="w-full rounded-lg border border-gray-300 py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                <option value="all">All Doctors</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                className={`w-full py-2 px-4 rounded-lg border ${
                  showTodayOnly
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300'
                } hover:bg-blue-700 hover:text-white transition-colors duration-200`}
                onClick={() => setShowTodayOnly(!showTodayOnly)}
              >
                Today's Appointments
              </button>
            </div>
          </div>
        </div>

        {/* Patient List */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="border-b border-gray-200 last:border-0">
              {/* Patient Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {patient.firstName} {patient.lastName}
                    </h2>
                    <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {patient.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {patient.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {patient.appointments.length} appointments
                    </span>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Appointments */}
                <div className="space-y-4">
                  {patient.appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <span>{format(new Date(appointment.date), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <span>{format(new Date(`2000-01-01T${appointment.time}`), 'h:mm a')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserCircle className="h-5 w-5 text-gray-400" />
                          <span>{getDoctorName(appointment.doctorId)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-gray-400" />
                          <span>{appointment.reason}</span>
                        </div>
                        {appointment.isNewPatient && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            New Patient
                          </span>
                        )}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === 'scheduled'
                              ? 'bg-green-100 text-green-800'
                              : appointment.status === 'completed'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditAppointment(patient, appointment)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAppointment(patient.id, appointment.id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Edit Appointment Modal */}
      <Transition show={isEditModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsEditModalOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog className="fixed inset-0 bg-black opacity-30" />
            </TransitionChild>

            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>

            <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                >
 

              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Edit Appointment
                </Dialog>

                {editingAppointment && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date</label>
                      <input
                        type="date"
                        value={editingAppointment.date}
                        onChange={(e) =>
                          setEditingAppointment({ ...editingAppointment, date: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Time</label>
                      <input
                        type="time"
                        value={editingAppointment.time}
                        onChange={(e) =>
                          setEditingAppointment({ ...editingAppointment, time: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Doctor</label>
                      <select
                        value={editingAppointment.doctorId}
                        onChange={(e) =>
                          setEditingAppointment({ ...editingAppointment, doctorId: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        {doctors.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Reason</label>
                      <input
                        type="text"
                        value={editingAppointment.reason}
                        onChange={(e) =>
                          setEditingAppointment({ ...editingAppointment, reason: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        value={editingAppointment.status}
                        onChange={(e) =>
                            setEditingAppointment({
                              ...editingAppointment,
                              status: e.target.value,
                            })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={handleSaveAppointment}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}