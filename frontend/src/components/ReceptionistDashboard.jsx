import { Link } from "react-router-dom";
import { 
  FaHome, FaClipboardCheck, FaCalendarAlt, FaUser, FaUserMd, 
  FaFileInvoiceDollar, FaCog, FaUserPlus
} from "react-icons/fa"; 

export default function ReceptionDashboard() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full bg-gray-800 text-white w-64 p-5">
        <h2 className="text-xl font-bold mb-6">Receptionist</h2>
        <ul className="mt-4 space-y-3">
          <li>
            <Link to="/" className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-700 rounded-md">
              <FaHome size={20} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/CheckInCheckOut" className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-700 rounded-md">
              <FaClipboardCheck size={20} />
              <span className="hidden sm:inline">Check-In/Check-Out</span>
            </Link>
          </li>
          <li>
            <Link to="/ReceptionistAppointment" className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-700 rounded-md">
              <FaCalendarAlt size={20} />
              <span className="hidden sm:inline">Appointments</span>
            </Link>
          </li>
          <li>
            <Link to="/patients" className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-700 rounded-md">
              <FaUser size={20} />
              <span className="hidden sm:inline">Patients</span>
            </Link>
          </li>
          <li>
            <Link to="/doctors" className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-700 rounded-md">
              <FaUserMd size={20} />
              <span className="hidden sm:inline">Doctors</span>
            </Link>
          </li>
          <li>
            <Link to="/billing" className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-700 rounded-md">
              <FaFileInvoiceDollar size={20} />
              <span className="hidden sm:inline">Billing & Payments</span>
            </Link>
          </li>
          <li>
            <Link to="/ReceptionistProfile" className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-700 rounded-md">
              <FaUserPlus size={20} />
              <span className="hidden sm:inline">Create a Profile</span>
            </Link>
          </li>
          <li>
            <Link to="/ReceptionistSettings" className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-700 rounded-md">
              <FaCog size={20} />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </li>
          <li>
            <Link to="/ReceptionistShift" className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-700 rounded-md">
              <FaCog size={20} />
              <span className="hidden sm:inline">Shifts</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="ml-64 flex-1 min-h-screen bg-gray-100 p-5">
        <div className="mt-4">
          <h1 className="text-2xl font-bold">Main Content</h1>
          <p className="mt-2">Content goes here...</p>
        </div>
      </div>
    </div>
  );
}

