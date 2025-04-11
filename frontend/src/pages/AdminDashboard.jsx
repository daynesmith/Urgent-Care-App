// AdminDashboard.jsx
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, Admin</h1>
      <div className="space-y-3">
        <Link
          to="/admin/employees"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded shadow">
          View All Employees
        </Link>
      </div>
    </div>
  );
}
