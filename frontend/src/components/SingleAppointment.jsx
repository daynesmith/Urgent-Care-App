import { Link } from 'react-router-dom'


export default function SingleAppointment(props){

    const [year, month, day] = props.date.split("-");

    const formattedDate = `${month}/${day}/${year}`;
    
    const formatTime = (timeString) => {
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    return(
        <Link to={`/visits/${props.data.appointmentid}`}>
        <li className="outline p-4 cursor-pointer" >
            {formattedDate}<br />
            {formatTime(props.time)}
        </li>
        </Link>
    );
}