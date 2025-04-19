import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const apiUrl = import.meta.env.VITE_API_URL;

export default function StaffShiftTable() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    date: '',
    clinicLocation: '',
    shiftType: 'all', 
  });
  const [filteredShifts, setFilteredShifts] = useState([]);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users/getStaffShifts`, {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
          },
        });
        setShifts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching shifts:', err);
        setError('Failed to load shifts.');
        setLoading(false);
      }
    };

    fetchShifts();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = shifts;

      if (filters.date) {
        filtered = filtered.filter((shift) => shift.date === filters.date);
      }
      if (filters.clinicLocation) {
        filtered = filtered.filter((shift) =>
          shift.cliniclocation
            .toLowerCase()
            .includes(filters.clinicLocation.toLowerCase())
        );
      }
      if (filters.shiftType === 'past') {
        filtered = filtered.filter((shift) => new Date(shift.date) < new Date());
      } else if (filters.shiftType === 'upcoming') {
        filtered = filtered.filter((shift) => new Date(shift.date) >= new Date());
      }

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

  const clearFilters = () => {
    setFilters({
      date: '',
      clinicLocation: '',
      shiftType: 'all',
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Scheduled Shifts</h3>

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
          <label className="block text-sm font-medium text-gray-700">Shift Type</label>
          <select
            value={filters.shiftType}
            onChange={(e) => setFilters({ ...filters, shiftType: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Shifts</option>
            <option value="past">Past Shifts</option>
            <option value="upcoming">Upcoming Shifts</option>
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

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
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
            <tr key={shift.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {shift.date || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatTime(shift.startshift || '00:00:00')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatTime(shift.endshift || '00:00:00')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {shift.cliniclocation || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {shift.notes || 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

StaffShiftTable.propTypes = {
  shifts: PropTypes.array,
  setShifts: PropTypes.func,
};