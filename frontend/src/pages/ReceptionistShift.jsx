import React, { useState } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import StaffDropDown from '../components/StaffDropDown';
import ReceptionistShiftTable from '../components/ReceptionistShiftTable'; 

const apiUrl = import.meta.env.VITE_API_URL;

export default function ReceptionistShift() {
  const [staff, setStaff] = useState('');
  const [shifts, setShifts] = useState([]); 
  const [isEditing, setIsEditing] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [newShift, setNewShift] = useState({
    staffId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '',
    endTime: '',
    cliniclocation: '',
    notes: '',
  });
  const [locationError, setLocationError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [popupMessage, setPopupMessage] = useState('');

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

    setLocationError('');
    setTimeError('');

    if (!staff) {
      setLocationError('Please select a staff member.');
      return;
    }

    try {
      const shiftData = {
        staffid: staff,
        startshift: newShift.startTime,
        endshift: newShift.endTime,
        date: newShift.date,
        notes: newShift.notes,
        cliniclocation: newShift.cliniclocation,
      };

      const response = await axios.post(`${apiUrl}/receptionist/addNewShift`, shiftData);

      console.log('Shift successfully added:', response.data);

      setShifts([...shifts, { ...newShift, id: response.data.shift.id }]);

      setNewShift({
        staffId: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '',
        endTime: '',
        cliniclocation: '',
        notes: '',
      });
      setStaff('');
    } catch (error) {
      console.error('Error submitting shift:', error);
      showPopup('Failed to submit shift. A shift already exists for this staff member. Please try again.');
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
            <h3 className="text-lg font-medium mb-4">
              {isEditing ? 'Edit Shift' : 'Add New Shift'}
            </h3>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700">Staff Member</label>
                <StaffDropDown staff={staff} setStaff={setStaff} />
              </div>
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={newShift.date}
                  onChange={(e) => setNewShift({ ...newShift, date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="time"
                  value={newShift.startTime}
                  onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="col-span-3">
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
              <div className="col-span-3">
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
              <div className="col-span-12">
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={newShift.notes}
                  onChange={(e) => setNewShift({ ...newShift, notes: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingShift(null);
                    setNewShift({
                      staffId: '',
                      date: format(new Date(), 'yyyy-MM-dd'),
                      startTime: '',
                      endTime: '',
                      cliniclocation: '',
                      notes: '',
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {isEditing ? 'Update Shift' : 'Add Shift'}
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

