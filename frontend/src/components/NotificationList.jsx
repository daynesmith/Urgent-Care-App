import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const apiUrl = import.meta.env.VITE_API_URL;

export default function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const decoded = jwtDecode(token);
        const userId = decoded.patientid || decoded.userid;  // 🔥 use the id we saved in token

        const res = await axios.get(`${apiUrl}/notifications`, {
          params: {
            userid: userId,
            page: page,
            limit: 10
          },
          headers: {
            accessToken: token
          }
        });

        setNotifications(res.data.notifications);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [page]); // re-fetch when page changes

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>

      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notif) => (
            <li key={notif.notificationid} className="border p-3 rounded shadow">
              <p>{notif.message}</p>
              <small className="text-gray-500">{new Date(notif.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
