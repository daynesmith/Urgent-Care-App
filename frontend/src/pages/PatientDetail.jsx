import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Stethoscope, Plus, X, AlertCircle, Send } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

export default function PatientDetail({ onSubmit }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [nurseNotes, setNurseNotes] = useState('');
  const [priority, setPriority] = useState('normal');
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [medications, setMedications] = useState('');
  const [usedSupplies, setUsedSupplies] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allergies, setAllergies] = useState('');
  const [supplies, setSupplies] = useState([]);
  const [error, setError] = useState('');
  const [newSupply, setNewSupply] = useState({ name: '', quantity: 1, notes: '' });

  const handleAddSupply = () => {
    if (!newSupply.name || !newSupply.quantity) return;
  
    setUsedSupplies((prev) => [
      ...prev,
      {
        name: newSupply.name,
        quantity: newSupply.quantity,
        notes: newSupply.notes,
      },
    ]);
  
    setNewSupply({ name: '', quantity: 1, notes: '' });
  };
  
  const handleRemoveSupply = (index) => {
    const updated = [...usedSupplies];
    updated.splice(index, 1);
    setUsedSupplies(updated);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const vitalsPayload = {
      visitid: parseInt(id),
      blood_pressure: vitals.bloodPressure, // keep as string
      heart_rate: parseInt(vitals.heartRate),
      respiratory_rate: parseInt(vitals.respiratoryRate),
      oxygen_saturation: parseFloat(vitals.oxygenSaturation),
      temperature: parseFloat(vitals.temperature),
      weight: parseFloat(vitals.weight),
      height: parseFloat(vitals.height),
      nurseNotes
    };
    
    console.log("Before submitting Visit info:", vitalsPayload);
  
    const suppliesPayload = {
      visitinfoid: id,
      supplies: usedSupplies, // assumed to be an array of { name, quantity, notes }
    };
    console.log("Before submitting Supplies log:",suppliesPayload )
    try {
      // First: send the vitals and nurse notes
      const responseVisit = await axios.post(`${apiUrl}/nurses/createVisitInfo`, vitalsPayload);
  
      // Then: send the supplies used
      const responseSupplies = await axios.post(`${apiUrl}/nurses/createUsedSupplies`, suppliesPayload);
  
      console.log("Both payloads submitted successfully");
      console.log("Visit Info Response:", responseVisit.data);
      console.log("Supplies Info Response:", responseSupplies.data);
      navigate('/dashboard'); 
    } catch (err) {
      console.error('One or both submissions failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, []);

  const fetchAppointment = async () => {
    try {
      // Send `id` as a query parameter in the GET request
      const response = await axios.get(`${apiUrl}/nurses/getSingleAppointment`, {
        params: { id }  // id will be sent as a query parameter
      });
  
      console.log("Fetched appointment:", response.data);
      setPatient(response.data);  // Set the appointment info state with the fetched data
    } catch (err) {
      console.error('Error fetching appointment:', err);
    }
  };
  useEffect(() => {
    fetchSupplies();
  }, []);
  const fetchSupplies = async () => {
    try {
      // Make an API call to your backend to fetch supplies
      const response = await axios.get(`${apiUrl}/nurses/getAllSupplies`);
        
      // Assuming response.data contains the list of supplies
      setSupplies(response.data); // Store supplies in state (replace 'setSupplies' with your actual state setter)
    } catch (err) {
      console.error('Error fetching supplies:', err);
      setError('Failed to fetch supplies.');
    }
  };

  console.log("Patient appointment info from dbms:", patient);
  console.log("Supplies we have:", supplies);

  const [vitals, setVitals] = useState({
    bloodPressure: '',
    temperature: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    weight: '',
    height: '',
  });



  if (!patient) return <div>Loading patient info...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Visit Documentation</h2>
        </div>
        <div className="flex items-center gap-2">
        </div>
      </div>

      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-lg">{patient.patient
                    ? `${patient.patient.firstname} ${patient.patient.lastname}`
                    : 'N/A'}</h3>
        <p className="text-sm text-gray-600">Age: {patient.age}</p>
        <p className="text-sm text-gray-600 mt-1">Reason: {patient.visitReason}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(vitals).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type="text"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={value}
                onChange={(e) => setVitals({ ...vitals, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nurse Notes</label>
          <textarea
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={4}
            value={nurseNotes}
            onChange={(e) => setNurseNotes(e.target.value)}
            placeholder="Additional observations and notes..."
          />
        </div>

        {/* Supplies Section */}
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Supplies Used</h3>
        <span className="text-sm text-gray-500">{usedSupplies.length} items</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Select Supply */}
        <div>
          <label className="block text-sm font-medium mb-1">Select Supply</label>
          <select
            className="w-full rounded-md border-gray-300"
            value={newSupply.name}
            onChange={(e) =>
              setNewSupply({ ...newSupply, name: e.target.value })
            }
          >
            <option value="">-- Choose --</option>
            {supplies.map((item) => (
              <option key={item.inventoryid} value={item.itemname}>
                {item.itemname}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            className="w-full rounded-md border-gray-300"
            value={newSupply.quantity}
            onChange={(e) =>
              setNewSupply({
                ...newSupply,
                quantity: parseInt(e.target.value) || 1,
              })
            }
          />
        </div>

        {/* Notes + Add Button */}
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="w-full rounded-md border-gray-300"
              value={newSupply.notes}
              onChange={(e) =>
                setNewSupply({ ...newSupply, notes: e.target.value })
              }
            />
            <button
              type="button"
              onClick={handleAddSupply}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Supply List */}
      {usedSupplies.length > 0 && (
        <div className="mt-4 border rounded-lg divide-y">
          {usedSupplies.map((supply, index) => (
            <div key={index} className="p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {supply.name} x{supply.quantity}
                </div>
                {supply.notes && (
                  <p className="text-sm text-gray-600">{supply.notes}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSupply(index)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-colors ${
            isSubmitting
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSubmitting ? (
            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send
            </>
          )}
        </button>
      </form>
    </div>
  );
}
