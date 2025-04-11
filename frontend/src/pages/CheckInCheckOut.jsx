import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

import {
    CalendarClock,
    ClipboardCheck,
    Clock,
    UserCircle,
    CheckCircle2,
    XCircle,
    Search,
    Plus,
    AlertCircle,
    Clock4
} from 'lucide-react';

export default function CheckInCheckOut() {
    const [appointments, setAppointments] = useState([]); // Changed to array
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]); 
    const [activeTab, setActiveTab] = useState('check-in');
    const [searchTerm, setSearchTerm] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [loading, setLoading] = useState(true); // Added loading state
    const [error, setError] = useState(null); // Added error state

    const fetchAppointments = async () => {
        try {
            const response = await axios.get(`${apiUrl}/appointments/getappointments`);
            setAppointments(response.data);
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError('Failed to get appointments.');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAppointments();
    }, []);

    
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get(`${apiUrl}/patient/patientsNames`);
                setPatients(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching patients:', err);
                setError('Failed to load patients.');
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    useEffect(() => {
        //fetch the doctor list from your API
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(`${apiUrl}/doctor/doctorsNames`); 
                setDoctors(response.data);  
                setLoading(false);
            } catch (err) {
                console.error('Error fetching doctors:', err);
                setError('Failed to load doctors.');
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);
/* return (
        <select
            id="patient"
            value={patient}
            onChange={(e) => setPatient(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-md p-2"
        >
            <option value="">Select a patient</option>
            {patients.map((pat) => (
                <option key={pat.patientid} value={pat.patientid}>
                    {pat.name}
                </option>
            ))}
        </select>
    );*/
    return (
        <div>
        {/* Map through the appointments and match the patientid from the patient map */}
        {appointments.map((appointment) => {
            console.log('Appointment:', appointment);

            // Create the patientMap once
            const patientMap = patients.reduce((map, pat) => {
                map[pat.patientid] = pat;  // Map patientid to patient object
                return map;
            }, {});

            // Create the doctorMap once
            const doctorMap = doctors.reduce((map, doc) => {
                map[doc.doctorid] = doc;  // Map patientid to patient object
                return map;
            }, {});

            // Find the patient associated with the current appointment using patientid
            const patient = patientMap[appointment.patientid];
            console.log('Patient for Appointment:', patient);

            // Find the patient associated with the current appointment using patientid
            const doctor = doctorMap[appointment.doctorid];
            console.log('Doctor for Appointment:', doctor);
            

            return (
                <div key={appointment.appointmentid}>
                    <p><strong>Appointment ID:</strong> {appointment.appointmentid}</p>
                    <p><strong>Patient:</strong> {patient ? patient.name : 'Unknown'}</p>
                    <p><strong>Doctor:</strong> {doctor ? doctor.name : 'Unknown'}</p>
                    <p><strong>Appointment Status:</strong> {appointment.appointmentstatus}</p>
                    <p><strong>Appointment Time:</strong> {appointment.requesteddate}</p>
                    <p><strong>Appointment Time:</strong> {appointment.requestedtime}</p>
                </div>
            );
        })}
    </div>
        
    );
}
