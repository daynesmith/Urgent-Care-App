import { Link } from 'react-router-dom';


export default function DoctorDashboard(){


    return(
    <div className="flex justify-center flex-row gap-2 text-sm font-mono">
        
        {/* will need to add links to all buttons later */}
        <Link to="/DoctorInfoForm" className="border rounded-l shadow-lg p-3 h-full text-center min-w-3xs"><h4>View Profile</h4> </Link> 
        <Link to="/DoctorAppointments" className="border rounded-l shadow-lg p-3 h-full text-center min-w-3xs"><h4>View Scheduled Appointments</h4> </Link> 
        <Link to="/DoctorPatients" className="border rounded-l shadow-lg p-3 h-full text-center min-w-3xs"><h4>View Patients</h4> </Link> 
        <Link to="/CreateReferral" className="border rounded-l shadow-lg p-3 h-full text-center min-w-3xs"><h4>Create Referrals</h4> </Link> 
        <Link to="/StaffViewShifts" className="border rounded-l shadow-lg p-3 h-full text-center min-w-3xs"><h4>View Shifts</h4> </Link> 
        
    </div>
    )
}

