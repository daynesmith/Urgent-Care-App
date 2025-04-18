import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function PatientDetails({ open, onClose }) {
  const { id } = useParams(); // Get patient ID from URL params
  const [visitDetails, setVisitDetails] = useState(null);

  if (!open) return null; // Don't render if the dialog is closed

  // Fetch visit details using the patient ID
  useEffect(() => {
    const fetchVisitDetails = async () => {
      try {
        const response = await get(`/visitinfo/getvisitinfo/${id}`); // Correct the URL with `id`
        console.log("apointment", response)
        const data = await response.json();
        setVisitDetails(data); // Set fetched visit details
      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    };

    if (id) fetchVisitDetails();
  }, [id]);

  if (!visitDetails) {
    return <div>Loading...</div>; // Handle loading state
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white max-h-[90vh] max-w-4xl w-full overflow-y-auto rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-lg"
        >
          &times;
        </button>

        <div>
          <h2 className="text-2xl font-bold">Visit Details</h2>
          <p className="text-sm text-gray-500">
            Visit information for {visitDetails.patientName} on {visitDetails.date}
          </p>
        </div>

        <div className="mt-6 space-y-6">
          {/* Header Info */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-semibold">{visitDetails.patientName}</h3>
              <p className="text-sm text-gray-500">Patient ID: {visitDetails.patientId}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm px-2 py-1 rounded ${
                  visitDetails.status === "Completed"
                    ? "border border-green-500 text-green-600"
                    : "bg-gray-100"
                }`}
              >
                {visitDetails.status}
              </span>
              <button className="text-sm border px-2 py-1 rounded hover:bg-gray-100">Print</button>
              <button className="text-sm border px-2 py-1 rounded hover:bg-gray-100">Download</button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Date & Time</p>
              <p>{visitDetails.date} at {visitDetails.time}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Provider</p>
              <p>{visitDetails.doctor} / {visitDetails.nurse}</p>
            </div>
          </div>

          <hr />

          {/* Vital Signs */}
          <div>
            <h4 className="mb-2 font-semibold">Vital Signs</h4>
            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries(visitDetails.vitalSigns).map(([key, value]) => (
                <div key={key}>
                  <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p>{value}</p>
                </div>
              ))}
            </div>
          </div>

          <hr />

          {/* Medical Info */}
          <div className="space-y-4">
            {[
              ["Chief Complaint", visitDetails.chiefComplaint],
              ["Symptoms", visitDetails.symptoms],
              ["Diagnosis", visitDetails.diagnosis],
              ["Treatment Plan", visitDetails.treatment],
              ["Additional Notes", visitDetails.notes],
              ["Follow-up", visitDetails.followUp]
            ].map(([title, value]) => (
              <div key={title}>
                <h4 className="font-semibold">{title}</h4>
                <p>{value}</p>
              </div>
            ))}
          </div>

          <hr />

          {/* Supplies */}
          <div>
            <h4 className="mb-2 font-semibold">Supplies Used</h4>
            {visitDetails.supplies.length > 0 ? (
              <table className="w-full border text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="border px-2 py-1">Item</th>
                    <th className="border px-2 py-1">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {visitDetails.supplies.map((supply) => (
                    <tr key={supply.id}>
                      <td className="border px-2 py-1">{supply.name}</td>
                      <td className="border px-2 py-1">{supply.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-gray-500">No supplies used during this visit.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
