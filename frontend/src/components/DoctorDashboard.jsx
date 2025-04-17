import { Link } from 'react-router-dom';
import NotificationBell from '../components/NotificationBell';

export default function DoctorDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Doctor Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="p-2 relative">
                <NotificationBell />
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="flex justify-center flex-row gap-2 text-sm font-mono"> 
      {/* will need to add links to all buttons later */}
      <Link to="/DoctorInfoForm" className="border rounded-l shadow-lg p-3 h-full text-center min-w-3xs"><h4>View Profile</h4> </Link> 
      <Link to="/DoctorAppointments" className="border rounded-l shadow-lg p-3 h-full text-center min-w-3xs"><h4>View Scheduled Appointments</h4> </Link> 
      <Link to="/DoctorPatients" className="border rounded-l shadow-lg p-3 h-full text-center min-w-3xs"><h4>View Patients</h4> </Link> 
      <Link to="/CreateReferral" className="border rounded-l shadow-lg p-3 h-full text-center min-w-3xs"><h4>Create Referrals</h4> </Link> 
      <Link to="/StaffViewShifts" className="border rounded-l shadow-lg p-3 h-full text-center min-w-3xs"><h4>View Shifts</h4> </Link> 
      </div>
    </div>
  );
}
