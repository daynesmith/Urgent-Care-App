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

export default function ScheduleAppointmentCalendar({ selectedStaffId }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState(null);

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


  useEffect(() => {
    const fetchShifts = async () => {
      if (!selectedStaffId) {
        setShifts([]);
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/users/getShiftsByStaffId/${selectedStaffId}`);
        if (response.data.length === 0) {
            setShifts([]); 
            setError('No shifts available for the selected staff.');
          } else {
            setShifts(response.data); 
            setError(null); 
          }
        } catch (err) {
          console.error('Failed to fetch shifts:', err);
          setShifts([]); 
          setError('Failed to load shifts.');
        }
    };

    fetchShifts();
  }, [currentMonth, selectedStaffId]);

  const getShiftsForDay = (day) => {
    return shifts.filter((shift) => {
      const shiftDate = parseISO(shift.date); 
      return isSameDay(shiftDate, day);
    });
  };

  const previousMonth = () => {
    setCurrentMonth((prev) => addDays(prev, -30));
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => addDays(prev, 30));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-2 lg:px-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Doctor Availability</h2>
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

        <h3 className="text-center font-medium mb-4">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>

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

      {/*selected day shifts */}
      {selectedDate && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-medium mb-4">
          {`${shifts[0]?.staff?.firstname || 'Staff'} ${shifts[0]?.staff?.lastname || ''}'s Availability`} - {format(selectedDate, 'MMMM d, yyyy')}
          </h4>
          {getShiftsForDay(selectedDate).length === 0 ? (
            <p className="text-sm text-gray-500">No shifts scheduled for this day.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 text-sm bg-white shadow rounded">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
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
                    {getShiftsForDay(selectedDate).map((shift) => {
                        const staffName = `${shift.staff?.firstname || 'N/A'} ${shift.staff?.lastname || 'N/A'}`;
                        return (
                        <tr key={shift.shiftid}>
                            <td className="px-4 py-2">{staffName}</td>
                            <td className="px-4 py-2">{shift.startshift || 'N/A'}</td>
                            <td className="px-4 py-2">{shift.endshift || 'N/A'}</td>
                            <td className="px-4 py-2">{shift.cliniclocation || 'N/A'}</td>
                        </tr>
                        );
                    })}
                </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}