import { useState, useEffect } from 'react';

import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL
import SingleAppointment from './SingleAppointment';


export default function Appointments(props){

    const token = props.token;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [futureAppointments, setFutureAppointments] = useState([]);
    const [pastAppointments, setPastAppointments] = useState([]);
    const [canceledAppointments, setCanceledAppointments] = useState([]);
    const [requestedAppointments, setRequestedAppointments] = useState([]);


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
        if (error.includes("404")) {
            return <div>You do not have an appointment history</div>
        }
        return <div>Error: {error}</div>;
    }


    return (
        <div>
            <h2 className="text-2xl">Upcoming visits</h2>
            {futureAppointments.length > 0 ? (
                <ul className="flex flex-row gap-2 bg-gray-200 p-2">
                    {futureAppointments.map((appointment) => (
                        <SingleAppointment key={appointment.appointmentid} data={appointment} date={appointment.requesteddate} time={appointment.requestedtime} />
                    ))}
                </ul>
            ) : (
                <p>No upcoming appointments.</p>
            )}
            <h2 className="text-2xl">Past visits</h2>
            {pastAppointments.length > 0 ? (
                <ul className="flex flex-row gap-2 bg-gray-100 p-2">
                    {pastAppointments.map((appointment) => (
                        <SingleAppointment key={appointment.appointmentid} data={appointment} date={appointment.requesteddate} time={appointment.requestedtime} />

                    ))}
                </ul>
            ) : (
                <p>No past appointments.</p>
            )}
            <h2 className="text-2xl">Canceled visits</h2>
            {canceledAppointments.length > 0 ? (
                <ul className="flex flex-row gap-2 bg-gray-100 p-2">
                    {canceledAppointments.map((appointment) => (
                        <SingleAppointment key={appointment.appointmentid} data={appointment} date={appointment.requesteddate} time={appointment.requestedtime} />

                    ))}
                </ul>
            ) : (
                <p>No canceled appointments.</p>
            )}
                        <h2 className="text-2xl">Requested visits</h2>
            {requestedAppointments.length > 0 ? (
                <ul className="flex flex-row gap-2 bg-gray-100 p-2">
                    {requestedAppointments.map((appointment) => (
                        <SingleAppointment key={appointment.appointmentid} data={appointment} date={appointment.requesteddate} time={appointment.requestedtime} />

                    ))}
                </ul>
            ) : (
                <p>No requested appointments.</p>
            )}

        </div>
    );
};

