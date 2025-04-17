import React, { useContext } from 'react';
import { UserContext } from '../context/Usercontext';
import { User, LogOut, House  } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';



export default function Navbar({ userRole, onDashboardClick }) {
  const { role, setRole } = useContext(UserContext);
  const navigate = useNavigate();

  const handleScrollLink = (sectionId) => {
    navigate(`/homepage#${sectionId}`);
  };


  const logout = () => {
    localStorage.clear();
    setRole(null);
    navigate('/homepage'); // Redirect after logout
  };

  const renderDashboardLink = () => {
    switch (role) {
      case 'admin':
        return (
          <Link
            to="/dashboard"
            onClick={onDashboardClick}
            className="flex items-center text-sm px-4 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
          >
            <User className="w-5 h-5" />
            <span className="ml-2 capitalize">{userRole} Admin</span>
          </Link>
          
        );

      case 'receptionist':
        return (
          <Link
            to="/dashboard"
            onClick={onDashboardClick}
            className="flex items-center text-sm px-4 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
          >
            <User className="w-5 h-5" />
            <span className="ml-2 capitalize">{userRole} Receptionist</span>
          </Link>
        );

        case 'doctor':
          return (
            <>
              <Link
                to="/dashboard"
                onClick={onDashboardClick}
                className="flex items-center text-sm px-4 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
              >
                <User className="w-5 h-5" />
                <span className="ml-2 capitalize">{userRole} Doctor</span>
              </Link>
        
              <Link
                to="/createreferral"
                className="flex items-center text-sm px-4 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="ml-2">Create Referral</span>
              </Link>
            </>
          );
          case 'specialist':
            return (
              <>
                <Link
                  to="/dashboard"
                  onClick={onDashboardClick}
                  className="flex items-center text-sm px-4 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                >
                  <User className="w-5 h-5" />
                  <span className="ml-2 capitalize">{userRole} Specialist</span>
                </Link>
              </>
            );       

      case 'patient':
        return (
          <Link
            to="/dashboard"
            onClick={onDashboardClick}
            className="flex items-center text-sm px-4 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
          >
            <User className="w-5 h-5" />
            <span className="ml-2 capitalize">{userRole} Patient</span>
          </Link>
        );

        default:
          return (
          <Link
            to="/homepage"
            className="flex items-center gap-3 px-4 py-2 rounded-sm text-base font-bold text-gray-650 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
          >
            <House className="w-5 h-5" />
            <span className="font-sans">Home</span>
          </Link>
          );

        
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <span className="text-blue-600 text-xl font-bold">MediCare</span>
          </div>

          <div className="flex items-center space-x-4">
            {renderDashboardLink()}

            {role && (
              <button
                onClick={logout}
                className="flex items-center text-sm px-4 py-2 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-50 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-2">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
