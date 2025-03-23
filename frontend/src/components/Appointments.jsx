import { useState, useEffect } from 'react';

import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL


export default function Appointments(props){

    const token = props.token;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [futureAppointments, setFutureAppointments] = useState([]);
    const [pastAppointments, setPastAppointments] = useState([]);
    const [canceledAppointments, setCanceledAppointments] = useState([]);
    const [requestedAppointments, setRequestedAppointments] = useState([]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    
    const formatTime = (timeString) => {
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    useEffect(() => {
        const fetchAppointments = async () => {
            try {

                const response = await axios.get(`${apiUrl}/appointments/patient-appointments`,{
                    headers: {
                    'accessToken':token
                    }
                });


                const future = [];
                const past = [];
                const canceled = [];
                const requested = [];

                // setAppointments(response.data);


                response.data.forEach((appointment) => {
                    
                    if (appointment.appointmentstatus == "scheduled") {
                        future.push(appointment);
                    } else if (appointment.appointmentstatus == "completed") {
                        past.push(appointment);
                    }
                    else if (appointment.appointmentstatus == "cancelled") {
                        canceled.push(appointment);
                    } else if (appointment.appointmentstatus == "requested") {
                        requested.push(appointment);
                    }
                });

                setFutureAppointments(future);
                setPastAppointments(past);
                setCanceledAppointments(canceled);
                setRequestedAppointments(requested);

            } catch (err) {
                setError(err.message); 
            } finally {
                setLoading(false); 
            }
        };

        fetchAppointments();
    }, []); 

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }


    return (
        <div>
            <h2 className="text-2xl">Upcoming visits</h2>
            {futureAppointments.length > 0 ? (
                <ul className="flex flex-row gap-2 bg-gray-200 p-2">
                    {futureAppointments.map((appointment) => (
                        <li className="outline p-4"key={appointment.appointmentid}>
                            {formatDate(appointment.requesteddate)}<br />
                            {formatTime(appointment.requestedtime)}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No upcoming appointments.</p>
            )}
            <h2 className="text-2xl">Past visits</h2>
            {pastAppointments.length > 0 ? (
                <ul className="flex flex-row gap-2 bg-gray-100 p-2">
                    {pastAppointments.map((appointment) => (
                        <li className="outline p-4"key={appointment.appointmentid}>
                            {formatDate(appointment.requesteddate)}<br />
                            {formatTime(appointment.requestedtime)}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No past appointments.</p>
            )}
            <h2 className="text-2xl">Canceled visits</h2>
            {canceledAppointments.length > 0 ? (
                <ul className="flex flex-row gap-2 bg-gray-100 p-2">
                    {canceledAppointments.map((appointment) => (
                        <li className="outline p-4"key={appointment.appointmentid}>
                            {formatDate(appointment.requesteddate)}<br />
                            {formatTime(appointment.requestedtime)}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No canceled appointments.</p>
            )}
                        <h2 className="text-2xl">Requested visits</h2>
            {requestedAppointments.length > 0 ? (
                <ul className="flex flex-row gap-2 bg-gray-100 p-2">
                    {requestedAppointments.map((appointment) => (
                        <li className="outline p-4"key={appointment.appointmentid}>
                            {formatDate(appointment.requesteddate)}<br />
                            {formatTime(appointment.requestedtime)}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No requested appointments.</p>
            )}

        </div>
    );
};

