import { Link } from 'react-router-dom';
import NotificationBell from '../components/NotificationBell';

export default function PatientDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Patient Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 relative">
                <NotificationBell />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/ScheduleAppointment" className="border rounded shadow-lg p-6 text-center min-w-[180px] bg-white hover:bg-gray-50">
            <h4>Schedule an Appointment</h4>
          </Link>
          <Link to="/visits" className="border rounded shadow-lg p-6 text-center min-w-[180px] bg-white hover:bg-gray-50">
            <h4>Visits</h4>
          </Link>
          <Link to="/medical-history" className="border rounded shadow-lg p-6 text-center min-w-[180px] bg-white hover:bg-gray-50">
            <h4>Medical History</h4>
          </Link>
          <Link to="/PatientInfo" className="border rounded shadow-lg p-6 text-center min-w-[180px] bg-white hover:bg-gray-50">
            <h4>Patient Profile</h4>
          </Link>
          <Link to="#" className="border rounded shadow-lg p-6 text-center min-w-[180px] bg-white hover:bg-gray-50">
            <h4>Billing</h4>
          </Link>
        </div>
      </div>
    </div>
  );
}
