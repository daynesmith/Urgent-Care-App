import React, { useEffect, useState } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;


export default function ReceptionistNotification() {

        const [notifications, setNotifications] = useState([]);
        const [loading, setLoading] = useState(true);
    
        useEffect(() => {
            const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.get(`${apiUrl}/notifications/receptionist`, {
                headers: {
                    'accessToken': token
                }
                });
                console.log("fetch notifications in receptionist notification running");
                console.log(response.data);
            setNotifications(response.data);
            } catch (error) {
            console.error('Error fetching notifications:', error);
            } finally {
            setLoading(false);
            }
        };
    
        fetchNotifications();
        }, []);

        if (loading) return <p>Loading notifications...</p>;

    return (
<div className="bg-white rounded-lg shadow">
  <div className="p-6">
    <h2 className="text-lg font-medium text-gray-900 mb-4">Notifications</h2>
    {notifications && notifications.length > 0 ? (
      notifications.map((notification) => (
        <div
          key={notification.notificationid} // Use notificationid as the unique key
          className="p-4 mb-3 bg-gray-100 rounded-lg"
        >
          <p className="text-sm font-medium text-gray-800">{notification.message || "No message available"} {/* Display message or fallback text */}</p>
        </div>
      ))
    ) : (
      <p className="text-sm text-gray-500">No notifications available</p> // Fallback text if no notifications
    )}
  </div>
</div>
    );
}