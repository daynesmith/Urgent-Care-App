import { Link } from 'react-router-dom';

export default function DoctorDashboard() {
    return (
        <div className="flex flex-wrap justify-center gap-4 p-4">
            <Link to="/DoctorInfoForm" className="border rounded shadow-lg p-4 min-w-[150px] text-center flex-1 sm:flex-none">
                <h4 className="font-mono text-sm">View Profile</h4>
            </Link>
            <Link to="/DoctorAppointments" className="border rounded shadow-lg p-4 min-w-[150px] text-center flex-1 sm:flex-none">
                <h4 className="font-mono text-sm">View Scheduled Appointments</h4>
            </Link>
            <Link to="/DoctorPatients" className="border rounded shadow-lg p-4 min-w-[150px] text-center flex-1 sm:flex-none">
                <h4 className="font-mono text-sm">View Patients</h4>
            </Link>
            <Link to="/CreateReferral" className="border rounded shadow-lg p-4 min-w-[150px] text-center flex-1 sm:flex-none">
                <h4 className="font-mono text-sm">Create Referrals</h4>
            </Link>
            <Link to="/StaffViewShifts" className="border rounded shadow-lg p-4 min-w-[150px] text-center flex-1 sm:flex-none">
                <h4 className="font-mono text-sm">View Shifts</h4>
            </Link>
        </div>
    );
}