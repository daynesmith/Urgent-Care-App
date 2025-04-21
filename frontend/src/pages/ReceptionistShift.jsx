import React, { useState } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { DateRangePicker } from 'react-date-range';
import StaffDropDown from '../components/StaffDropDown';
import ReceptionistShiftTable from '../components/ReceptionistShiftTable';

import 'react-date-range/dist/styles.css'; // Main style file for react-date-range
import 'react-date-range/dist/theme/default.css'; // Default theme for react-date-range

const apiUrl = import.meta.env.VITE_API_URL;

export default function ReceptionistShift() {
  const [staff, setStaff] = useState('');
  const [shifts, setShifts] = useState([]);
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });
  const [newShift, setNewShift] = useState({
    startTime: '',
    endTime: '',
    cliniclocation: '',
    notes: '',
  });
  const [locationError, setLocationError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [popupMessage, setPopupMessage] = useState('');

  const handleRangeChange = (ranges) => {
    setSelectedRange(ranges.selection);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const locationRegex = /^[a-zA-Z\s]+, [A-Z]{2}$/;
    if (!locationRegex.test(newShift.cliniclocation)) {
      setLocationError('Clinic location must be in the format "City, TX" (e.g., Houston, TX)');
      return;
    }

    if (newShift.startTime >= newShift.endTime) {
      setTimeError('Start time must be before end time.');
      return;
    }

    if (!staff) {
      setLocationError('Please select a staff member.');
      return;
    }

    setLocationError('');
    setTimeError('');

    try {
      // Generate all dates in the selected range
      const startDate = new Date(selectedRange.startDate);
      const endDate = new Date(selectedRange.endDate);
      const dateArray = [];
      for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        dateArray.push(format(new Date(date), 'yyyy-MM-dd'));
      }

      // Prepare the array of shifts
      const shiftData = dateArray.map((date) => ({
        staffid: staff,
        startshift: newShift.startTime,
        endshift: newShift.endTime,
        date,
        notes: newShift.notes,
        cliniclocation: newShift.cliniclocation,
      }));

      const response = await axios.post(`${apiUrl}/receptionist/addNewShift`, shiftData);

      console.log('Shifts successfully added:', response.data);

      setShifts([...shifts, ...shiftData]);

      // Reset form
      setNewShift({
        startTime: '',
        endTime: '',
        cliniclocation: '',
        notes: '',
      });
      setStaff('');
      setSelectedRange({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      });
    } catch (error) {
      console.error('Error submitting shifts:', error);
      showPopup('Failed to submit shifts. Please try again.');
    }
  };

  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => {
      setPopupMessage('');
    }, 3000);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      {popupMessage && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {popupMessage}
        </div>
      )}

      <header className="bg-blue-600 text-white py-4 px-6">
        <h1 className="text-2xl font-bold">Receptionist Shift Management</h1>
      </header>

      <main className="flex-1 p-6">
        <div className="space-y-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-sm space-y-4 w-full"
          >
            <h3 className="text-lg font-medium mb-4">Add New Shifts</h3>
            <div className="grid grid-cols-12 gap-4">
              {/* Left Side */}
              <div className="col-span-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Staff Member</label>
                  <StaffDropDown staff={staff} setStaff={setStaff} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                    <input
                      type="time"
                      value={newShift.startTime}
                      onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                    <input
                      type="time"
                      value={newShift.endTime}
                      onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    {timeError && (
                      <p className="text-red-500 text-sm mt-1">{timeError}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Clinic Location</label>
                  <input
                    type="text"
                    value={newShift.cliniclocation}
                    onChange={(e) => setNewShift({ ...newShift, cliniclocation: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter clinic location (e.g., Houston, TX)"
                    required
                  />
                  {locationError && (
                    <p className="text-red-500 text-sm mt-1">{locationError}</p>
                  )}
                </div>
              </div>

              {/* Right Side */}
              <div className="col-span-6">
                <label className="block text-sm font-medium text-gray-700">Select Date Range</label>
                <div className="mt-1">
                  <DateRangePicker
                    ranges={[selectedRange]}
                    onChange={handleRangeChange}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Notes (Bottom Section) */}
              <div className="col-span-12">
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={newShift.notes}
                  onChange={(e) => setNewShift({ ...newShift, notes: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  placeholder="Add any relevant notes (optional)"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Shifts
              </button>
            </div>
          </form>

          {/* shift table section */}
          <ReceptionistShiftTable shifts={shifts} setShifts={setShifts} />
        </div>
      </main>
    </div>
  );
}