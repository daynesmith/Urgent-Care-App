import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const apiUrl = import.meta.env.VITE_API_URL;

export default function ReceptionistShiftTable({ shifts, setShifts }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    date: '',
    staff: '',
    clinicLocation: '',
    role: '',
    sortOrder: 'asc', 
  });
  const [filteredShifts, setFilteredShifts] = useState([]);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/receptionist/getAllShifts`);
        setShifts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching shifts:', err);
        setError('Failed to load shifts.');
        setLoading(false);
      }
    };

    fetchShifts();
  }, [setShifts]);

  console.log("all of the shifts:", shifts)

  useEffect(() => {
    const applyFilters = () => {
      let filtered = shifts;

      if (filters.date) {
        filtered = filtered.filter((shift) => shift.date === filters.date);
      }

      if (filters.staff) {
        filtered = filtered.filter((shift) =>
          `${shift.staff?.firstname} ${shift.staff?.lastname}`
            .toLowerCase()
            .includes(filters.staff.toLowerCase())
        );
      }

      if (filters.clinicLocation) {
        filtered = filtered.filter((shift) =>
          shift.cliniclocation
            .toLowerCase()
            .includes(filters.clinicLocation.toLowerCase())
        );
      }

      if (filters.role) {
        filtered = filtered.filter((shift) =>
          shift.staff?.role.toLowerCase().includes(filters.role.toLowerCase())
        );
      }

      filtered.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return filters.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });

      setFilteredShifts(filtered);
    };

    applyFilters();
  }, [filters, shifts]);

  if (loading) {
    return <div>Loading shifts...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const formatTime = (time) => {
    if (!time) return 'N/A';
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const capitalize = (str) => {
    if (!str) return 'N/A';
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const clearFilters = () => {
    setFilters({
      date: '',
      staff: '',
      clinicLocation: '',
      role: '',
      sortOrder: 'asc', 
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Scheduled Shifts</h3>

      {/* filter */}
      <div className="grid grid-cols-12 gap-4 mb-4">
        <div className="col-span-3">
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="col-span-3">
          <label className="block text-sm font-medium text-gray-700">Staff Member</label>
          <input
            type="text"
            placeholder="Search by staff member"
            value={filters.staff}
            onChange={(e) => setFilters({ ...filters, staff: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="col-span-3">
          <label className="block text-sm font-medium text-gray-700">Clinic Location</label>
          <input
            type="text"
            placeholder="Search by clinic location"
            value={filters.clinicLocation}
            onChange={(e) =>
              setFilters({ ...filters, clinicLocation: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="col-span-3">
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <input
            type="text"
            placeholder="Search by role"
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="col-span-3">
          <label className="block text-sm font-medium text-gray-700">Sort Order</label>
          <select
            value={filters.sortOrder}
            onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end mb-4">
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>

      {/* table section */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Staff Member
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Start Time
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              End Time
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Clinic Location
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Notes
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredShifts.map((shift) => (
            <tr key={`${shift.staffid}-${shift.date}-${shift.startshift}-${shift.cliniclocation}`}>              
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {capitalize(`${shift.staff?.firstname} ${shift.staff?.lastname}`)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {capitalize(shift.staff?.role)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shift.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatTime(shift.startshift)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatTime(shift.endshift)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shift.cliniclocation}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shift.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

ReceptionistShiftTable.propTypes = {
  shifts: PropTypes.array.isRequired,
  setShifts: PropTypes.func.isRequired,
};