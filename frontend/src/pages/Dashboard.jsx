import { useEffect, useState } from "react";
import axios from "axios";

// Import role-specific dashboard components
import AdminDashboard from "./AdminDashboard";
import DoctorDashboard from "./DoctorDashboard";
import ReceptionistDashboard from "./ReceptionistDashboard";
import PatientDashboard from "./PatientDashboard";

const apiUrl = import.meta.env.VITE_API_URL; // Ensure your .env file is correct

export default function Dashboard() {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                console.log("Fetching user role from:", `${apiUrl}/users/me`);
                const response = await axios.get(`${apiUrl}/users/me`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
                    withCredentials: true
                });
                console.log("User role received:", response.data.role);
                setRole(response.data.role);
            } catch (error) {
                console.error("Error fetching user role:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserRole();
    }, []);

    if (loading) return <p>Loading...</p>;

    switch (role) {
        case "admin":
            return <AdminDashboard />;
        case "doctor":
            return <DoctorDashboard />;
        case "receptionist":
            return <ReceptionistDashboard />;
        case "patient":
            return <PatientDashboard />;
        default:
            return <p>Unauthorized: No valid role found.</p>;
    }
}
