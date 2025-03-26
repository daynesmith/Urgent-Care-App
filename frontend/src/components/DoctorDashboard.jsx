import { Link } from 'react-router-dom';


export default function DoctorDashboard(){


    return(
    <div className="flex justify-center flex-row flex-nowrap gap-2 text-sm font-mono">
        
        {/* will need to add links to all buttons later */}
        <Link to="/DoctorInfoForm" className="border rounded-l shadow-lg p-3 h-full text-center min-w-3xs"><h4>View Profile</h4> </Link> 
        <Link as={Link} className="border rounded-l shadow-lg p-3 h-full text-center min-w-3xs"><h4>View Scheduled Appointments</h4> </Link> 
        
    </div>
    )
}

