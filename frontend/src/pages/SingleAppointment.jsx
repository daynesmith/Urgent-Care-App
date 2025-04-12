import { useParams } from 'react-router'
import { useState, useEffect } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL


export default function SingleAppointment(props){
    const { apptid } = useParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ appointment, setAppointment ] = useState(null);
    const [ date, setDate ] = useState(null);
    const [time, setTime ] = useState();

    useEffect(() => {
        const fetchAppointment = async () => {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                setError("No access token found. Please log in again.");
                return;
            }
            try {

                const response = await axios.get(`${apiUrl}/appointments/appointment/${apptid}`, {
                    headers: {
                    'accessToken':token
                    }
                });
                setAppointment(response.data);
                const [year, month, day] = response.data.requesteddate.split("-");

                const formattedDate = `${month}/${day}/${year}`;
                  
                const formattedTime = new Date(`1970-01-01T${response.data.requestedtime}`).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  setDate(formattedDate);
                  setTime(formattedTime);

            } catch (err) {
                setError(err.message); 
            } finally {
                setLoading(false); 
            }
        };

        fetchAppointment();
    }, []); 

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        if (error.includes("404")) {
            return <div>You do not have an appointment</div>
        }
        return <div>Error: {error}</div>;
    }



    return(
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">Appointment Details</h2>
  <div className="space-y-2">
    {/* <p><span className="font-medium">Doctor:</span> {appointment.doctor_name}</p> */}
    <p><span className="font-medium">Date:</span> {date}</p>
    <p><span className="font-medium">Time:</span> {time}</p>
    <p><span className="font-medium">Status:</span> {appointment.appointmentstatus}</p>
  </div>
</div>
    )
}