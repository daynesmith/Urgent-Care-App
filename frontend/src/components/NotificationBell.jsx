import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell } from 'lucide-react'; // Lucide React Icons — or any other bell icon you want
import { jwtDecode } from 'jwt-decode';

const apiUrl = import.meta.env.VITE_API_URL;

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const decoded = jwtDecode(token);
        const userId = decoded.patientid || decoded.userid;

        const res = await axios.get(`${apiUrl}/notifications`, {
          params: { userid: userId, page: 1, limit: 50 },
          headers: { accessToken: token }
        });

        setNotifications(res.data.notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // Auto-refresh notifications every 60 seconds (optional)
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (notificationid) => {
    try {
      const token = localStorage.getItem('accessToken');
  
      await axios.put(`${apiUrl}/notifications/${notificationid}/read`, {}, {
        headers: { accessToken: token }
      });
  
      // After marking as read, refresh notifications
      const res = await axios.get(`${apiUrl}/notifications`, {
        params: { userid: jwtDecode(token).patientid || jwtDecode(token).userid, page: 1, limit: 50 },
        headers: { accessToken: token }
      });
  
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };
  
  const unreadCount = notifications.filter(notif => !notif.is_read).length;

  return (
    <>
      {/* Bell Icon */}
      <div className="relative">
        <button onClick={() => setIsOpen(!isOpen)} className="relative">
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
  
      {/* Sidebar -- move this OUTSIDE the bell */}
      {isOpen && (
        <div className="fixed top-45 right-0 w-80 bg-white rounded-l-2xl shadow-lg z-50 p-6 overflow-y-auto max-h-[80vh] transition-transform duration-300 transform translate-x-0">
          {/* Top-right Close button */}
          <button 
            onClick={() => setIsOpen(false)} 
            className="absolute top-2 right-2 text-gray-600 hover:text-black"
          >
            ✖
          </button>
  
          <h3 className="font-semibold text-lg mb-4">Notifications</h3>
  
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            <ul className="space-y-4">
              {notifications
                .filter((notif) => !notif.is_read)
                .map((notif) => (
                <li key={notif.notificationid} 
                  onClick= {() => markAsRead(notif.notificationid)}
                  className="cursor-pointer hover:bg-gray-100 transition p-2 rounded">
                  <p>{notif.message}</p>
                  <small className="text-gray-500">{new Date(notif.createdAt).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}
