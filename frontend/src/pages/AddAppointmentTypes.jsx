import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { X, Plus } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL;

export default function AddAppointmentTypes({ setShowAddAppointmentModal }) {
  const navigate = useNavigate();

  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newType, setNewType] = useState({
    itemname: '',
    cost: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewType((prev) => ({
      ...prev,
      [name]: name === 'cost' ? Number(value) : value, // Convert cost to number
    }));
  };

  // Close modal
  const handleClose = () => {
    if (setShowAddAppointmentModal) {
      setShowAddAppointmentModal(false);
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    const fetchAppointmentTypes = async () => {
      try {
        const response = await axios.get(`${apiUrl}/inventory/getappointmenttypes`);
        setAppointmentTypes(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointmentTypes();
  }, []);

  const isDuplicate = () => {
    return appointmentTypes.some(
      (type) => type.itemname.toLowerCase().trim() === newType.itemname.toLowerCase().trim()
    );
  };

  const handleAddAppointmentType = async () => {
    if (isDuplicate()) {
      setError('This appointment type already exists.');
      return;
    }
  
    console.log('New type data:', newType); // Log the data being sent
  
    try {
      const response = await axios.post(`${apiUrl}/inventory/addappointmenttypes`, newType);
      setAppointmentTypes((prev) => [...prev, response.data]);
      console.log('Appointment type added:', response.data);
      setNewType({ itemname: '', cost: 0 }); // Reset cost to 0 instead of empty string
      setError(null);
      handleClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Appointment Type</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

        <div className="space-y-4">
          {loading ? (
            <p className="text-sm text-gray-500">Loading appointment types...</p>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type Name</label>
                <input
                  type="text"
                  name="itemname"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="e.g., Consultation, Follow-up"
                  value={newType.itemname}
                  onChange={handleChange} // Using handleChange to update state dynamically
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
                <input
                  type="number"
                  name="cost"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Enter cost"
                  value={newType.cost}
                  onChange={handleChange} // Using handleChange to update state dynamically
                />
              </div>

            </>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddAppointmentType}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              disabled={!newType.itemname.trim() || !newType.cost}
            >
              <Plus size={16} className="mr-2" />
              Add Type
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
