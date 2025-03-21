import { Link } from 'react-router-dom';


export default function PatientDashboard(){


    return(
    <div className="flex justify-center flex-row flex-nowrap gap-2 text-sm font-mono">
        
        {/* will need to add links to all buttons later */}
        <Link to="/PatientAppointment" className="border rounded-l shadow-lg p-3 h-full text-center min-w-3xs"><h4>Schedule an Appointment</h4> </Link> 
        <Link as={Link} className="border rounded-l shadow-lg p-3 h-full text-center min-w-3xs"><h4>Visits</h4> </Link> 
        <Link as={Link} className="border rounded-l shadow-lg p-3 h-full text-center min-w-3xs"><h4>Something else</h4> </Link> 
        <Link as={Link} className="border rounded-l shadow-lg p-3 h-full text-center min-w-3xs"><h4>Something else</h4> </Link> 
        <Link as={Link} className="border rounded-l shadow-lg p-3 h-full text-center min-w-3xs"><h4>Billing</h4> </Link> 

        
    </div>
    )
}