import { useEffect, useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchEmployees = async (role = "all") => {
    try {
      const res = await axios.get(`${apiUrl}/admin/employees`, {
        params: role !== "all" ? { role } : {},
      });
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to load employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleFilterChange = (e) => {
    const selectedRole = e.target.value;
    setRoleFilter(selectedRole);
    fetchEmployees(selectedRole);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Employee Directory</h2>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by Role:</label>
        <select
          value={roleFilter}
          onChange={handleFilterChange}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All</option>
          <option value="doctor">Doctors</option>
          <option value="receptionist">Receptionists</option>
          <option value="specialist">Specialists</option>
        </select>
      </div>

      <table className="w-full border border-gray-300 text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">User ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr><td colSpan="3" className="p-4 text-center">No employees found</td></tr>
          ) : (
            employees.map((emp) => (
              <tr key={emp.userid} className="border-t">
                <td className="p-2">{emp.userid}</td>
                <td className="p-2">{emp.name}</td>
                <td className="p-2 capitalize">{emp.role}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
