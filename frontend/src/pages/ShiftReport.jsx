// ShiftReport.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;


function ShiftReport() {
    const [shifts, setShifts] = useState([]);
    const [roleFilter, setRoleFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [lastNameFilter, setLastNameFilter] = useState("");  // Changed from nameFilter to lastNameFilter
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const fetchShifts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (roleFilter) params.role = roleFilter;
        if (locationFilter) params.location = locationFilter;
        if (dateFilter) params.date = dateFilter;
        if (lastNameFilter) params.lastname = lastNameFilter; // Send lastNameFilter instead of nameFilter
  
        const res = await axios.get(`${apiUrl}/api/reports/shift-info`, { params });
        setShifts(res.data);
      } catch (err) {
        console.error("Error fetching shift report:", err);
        setError("Failed to fetch shift data.");
        setShifts([]);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchShifts();
    }, [roleFilter, locationFilter, dateFilter, lastNameFilter]);  // Use lastNameFilter instead of nameFilter
  
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Shift Report</h1>
        <div className="flex gap-4 mb-4 flex-wrap">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Roles</option>
            <option value="doctor">Doctor</option>
            <option value="receptionist">Receptionist</option>
            <option value="specialist">Specialist</option>
            <option value="admin">Admin</option>
          </select>
  
          <input
            type="text"
            placeholder="Filter by Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="border p-2 rounded"
          />
  
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border p-2 rounded"
          />
  
          <input
            type="text"
            placeholder="Filter by Last Name"
            value={lastNameFilter}  // Update field name
            onChange={(e) => setLastNameFilter(e.target.value)}  // Update field name
            className="border p-2 rounded"
          />
  
          <button
            onClick={() => {
              setRoleFilter("");
              setLocationFilter("");
              setDateFilter("");
              setLastNameFilter("");  // Clear last name filter
            }}
            className="border p-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Clear Filters
          </button>
        </div>
  
        {loading ? (
          <p>Loading shift data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : shifts.length === 0 ? (
          <p>No shifts found.</p>
        ) : (
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border p-2">Shift ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Location</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Start</th>
                <th className="border p-2">End</th>
                <th className="border p-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift) => (
                <tr key={shift.shiftid}>
                  <td className="border p-2">{shift.shiftid}</td>
                  <td className="border p-2">
                    {shift.staff ? `${shift.staff.firstname} ${shift.staff.lastname}` : "-"}
                  </td>
                  <td className="border p-2">{shift.staff ? shift.staff.role : "-"}</td>
                  <td className="border p-2">{shift.cliniclocation}</td>
                  <td className="border p-2">{shift.date}</td>
                  <td className="border p-2">{shift.startshift}</td>
                  <td className="border p-2">{shift.endshift}</td>
                  <td className="border p-2">{shift.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
  
  export default ShiftReport;
  
