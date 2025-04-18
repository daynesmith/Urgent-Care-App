import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  format,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
  addDays,
  startOfWeek,
  endOfWeek,
  parseISO,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL;

export default function StaffShiftCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState(null);

  // Generate calendar days for the current month
  useEffect(() => {
    const startDate = startOfWeek(startOfMonth(currentMonth));
    const endDate = endOfWeek(endOfMonth(currentMonth));

    const days = [];
    let currentDay = startDate;
    while (currentDay <= endDate) {
      days.push(currentDay);
      currentDay = addDays(currentDay, 1);
    }
    setCalendarDays(days);
  }, [currentMonth]);

  // Fetch shifts for the selected month
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users/getStaffShifts`, {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
          },
        });
        setShifts(response.data);
      } catch (err) {
        console.error('Failed to fetch shifts:', err);
        setError('Failed to load shifts.');
      }
    };

    fetchShifts();
  }, [currentMonth]);

  // Get shifts for a specific day
  const getShiftsForDay = (day) => {
    return shifts.filter((shift) => {
      const shiftDate = parseISO(shift.date); // Parse the date without time zone adjustments
      return isSameDay(shiftDate, day);
    });
  };

  // Handle navigation to the previous month
  const previousMonth = () => {
    setCurrentMonth((prev) => addDays(prev, -30));
  };

  // Handle navigation to the next month
  const nextMonth = () => {
    setCurrentMonth((prev) => addDays(prev, 30));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-2 lg:px-8">
      <div className="bg-white rounded-lg shadow p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Shift Calendar</h2>
          <div className="flex space-x-2">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Current Month */}
        <h3 className="text-center font-medium mb-4">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const shiftsForDay = getShiftsForDay(day);
            const hasShifts = shiftsForDay.length > 0;
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));

            return (
              <button
                key={day.toISOString()}
                onClick={() => !isPast && setSelectedDate(day)}
                disabled={isPast}
                className={`aspect-square p-1 relative hover:bg-gray-50 cursor-pointer
                  ${!isCurrentMonth ? 'text-gray-400' : ''}
                  ${isSelected ? 'ring-2 ring-blue-500 rounded-md' : ''}
                  ${isPast ? 'cursor-not-allowed opacity-50 hover:bg-transparent' : ''}
                  ${hasShifts && !isPast ? 'font-semibold' : ''}
                `}
              >
                <time dateTime={format(day, 'yyyy-MM-dd')}>
                  {format(day, 'd')}
                </time>
                {hasShifts && !isPast && (
                  <div
                    className={`absolute bottom-1 right-1 w-2 h-2 rounded-full
                      ${isCurrentMonth ? 'bg-blue-600' : 'bg-gray-400'}
                    `}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Shifts */}
      {selectedDate && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-medium mb-4">
            Shifts for {format(selectedDate, 'MMMM d, yyyy')}
          </h4>
          {getShiftsForDay(selectedDate).length === 0 ? (
            <p className="text-sm text-gray-500">No shifts scheduled for this day.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 text-sm bg-white shadow rounded">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Time
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clinic Location
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getShiftsForDay(selectedDate).map((shift) => (
                  <tr key={shift.id}>
                    <td className="px-4 py-2">{`${shift.staff?.firstname || 'N/A'} ${shift.staff?.lastname || 'N/A'}`}</td>
                    <td className="px-4 py-2">{shift.staff?.role || 'N/A'}</td>
                    <td className="px-4 py-2">{shift.startshift || 'N/A'}</td>
                    <td className="px-4 py-2">{shift.endshift || 'N/A'}</td>
                    <td className="px-4 py-2">{shift.cliniclocation || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}