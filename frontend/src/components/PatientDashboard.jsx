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
          <Link to="/ScheduleAppointment" className="border rounded-l shadow-lg p-3 h-full text-center min-w-3xs"><h4>Schedule an Appointment</h4> </Link> 
          <Link as={Link} to='/visits' className="border rounded-l shadow-lg p-3 h-full text-center min-w-3xs"><h4>Visits</h4> </Link> 
          <Link as={Link} to='/medical-history' className="border rounded-l shadow-lg p-3 h-full text-center min-w-3xs"><h4>Medical History</h4> </Link> 
          <Link to="/PatientInfo"  className="border rounded-l shadow-lg p-3 h-full text-center min-w-3xs"><h4>Patient Profile</h4> </Link> 
          <Link as={Link} to='/patient-billing' className="border rounded-l shadow-lg p-3 h-full text-center min-w-3xs"><h4>Billing</h4> </Link> 
        </div>
      </div>
    </div>
  );
}

      //div className="flex justify-center flex-row flex-nowrap gap-2 text-sm font-mono">