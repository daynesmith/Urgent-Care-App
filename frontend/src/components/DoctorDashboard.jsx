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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/DoctorInfoForm" className="border rounded shadow-lg p-6 text-center min-w-[180px] bg-white hover:bg-gray-50">
            <h4>View Profile</h4>
          </Link>
          <Link to="/DoctorAppointments" className="border rounded shadow-lg p-6 text-center min-w-[180px] bg-white hover:bg-gray-50">
            <h4>View Scheduled Appointments</h4>
          </Link>
          <Link to="/DoctorPatients" className="border rounded shadow-lg p-6 text-center min-w-[180px] bg-white hover:bg-gray-50">
            <h4>View Patients</h4>
          </Link>
          <Link to="/CreateReferral" className="border rounded shadow-lg p-6 text-center min-w-[180px] bg-white hover:bg-gray-50">
            <h4>Create Referrals</h4>
          </Link>
        </div>
      </div>
    </div>
  );
}
