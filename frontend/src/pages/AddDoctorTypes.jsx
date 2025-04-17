import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { X, Plus } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL;

export default function AddDoctorTypes({ setShowAddDoctorModal }) {
  const navigate = useNavigate();

  const [doctorTypes, setDoctorTypes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newDoctor, setNewDoctor] = useState({
    itemname: '',
    cost: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor((prev) => ({
      ...prev,
      [name]: name === 'cost' ? Number(value) : value,
    }));
  };

  const handleClose = () => {
    if (setShowAddDoctorModal) {
        setShowAddDoctorModal(false);
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    const fetchDoctorTypes = async () => {
      try {
        const response = await axios.get(`${apiUrl}/inventory/getdoctortypes`);
        setDoctorTypes(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorTypes();
  }, []);

  const isDuplicate = () => {
    return doctorTypes.some(
      (type) => type.itemname.toLowerCase().trim() === newDoctor.itemname.toLowerCase().trim()
    );
  };

  const handleAddDoctorType = async () => {
    if (isDuplicate()) {
      setError('This doctor type already exists.');
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/inventory/adddoctortypes`, newDoctor);
      setDoctorTypes((prev) => [...prev, response.data]); // Update list
      setNewDoctor({ itemname: '', cost: '' }); // Clear form
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
          <h2 className="text-xl font-semibold">Add New Doctor Type</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

        <div className="space-y-4">
          {loading ? (
            <p className="text-sm text-gray-500">Loading doctor types...</p>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor Type Name
                </label>
                <input
                  type="text"
                  name="itemname"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="e.g., Pediatrician, Cardiologist"
                  value={newDoctor.itemname}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
                <input
                  type="number"
                  name="cost"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Enter cost"
                  value={newDoctor.cost}
                  onChange={handleChange}
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
              onClick={handleAddDoctorType}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              disabled={!newDoctor.itemname.trim() || !newDoctor.cost}
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
