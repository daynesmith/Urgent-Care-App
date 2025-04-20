import React, { useState } from 'react';
import PropTypes from 'prop-types';

export function VisitFormNurse({ patient, onSubmit }) {
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState('normal');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      patientId: patient.id,
      notes,
      priority,
      timestamp: new Date().toISOString(),
    });
    setNotes('');
    setPriority('normal');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Visit Form for {patient.name}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Visit Notes</label>
          <textarea
            className="w-full border rounded-md p-2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="4"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            className="w-full border rounded-md p-2"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Visit
        </button>
      </form>
    </div>
  );
}

VisitFormNurse.propTypes = {
  patient: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
