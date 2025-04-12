import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/Usercontext';

const apiUrl = import.meta.env.VITE_API_URL;

const ViewPatients = () => {
    const { userId } = useContext(UserContext);
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); 

    useEffect(() => {
        const fetchPatientsWithMedicalHistory = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!userId) {
                    setError('Doctor ID is not available.');
                    return;
                }

                const patientsRes = await axios.get(`${apiUrl}/patient/by-doctor`, {
                    headers: { accessToken: token },
                    params: { doctor_id: userId },
                });

                const patientsData = patientsRes.data;
                setPatients(patientsData);
                setFilteredPatients(patientsData);
            } catch (err) {
                console.error('Error fetching patients or medical history:', err);
                setError('Failed to load patients or medical history.');
            } finally {
                setLoading(false);
            }
        };

        fetchPatientsWithMedicalHistory();
    }, [userId]);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = patients.filter((patient) =>
            `${patient.firstname} ${patient.lastname}`.toLowerCase().includes(term)
        );
        setFilteredPatients(filtered);
    };

    const handleSort = () => {
        const sorted = [...filteredPatients].sort((a, b) => {
            const nameA = `${a.firstname} ${a.lastname}`.toLowerCase();
            const nameB = `${b.firstname} ${b.lastname}`.toLowerCase();
            if (sortOrder === 'asc') {
                return nameA > nameB ? 1 : -1;
            } else {
                return nameA < nameB ? 1 : -1;
            }
        });
        setFilteredPatients(sorted);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleSelectPatient = (patient) => {
        setSelectedPatient(patient);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Patients</h2>

            <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={handleSearch}
                className="border p-2 w-full mb-4"
            />

            <button
                onClick={handleSort}
                className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
            >
                Sort by Name ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
            </button>

            {filteredPatients.length > 0 ? (
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2">Name</th>
                            <th className="border border-gray-300 p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.map((patient) => (
                            <tr key={patient.patientid}>
                                <td className="border border-gray-300 p-2">
                                    {patient.firstname} {patient.lastname}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    <button
                                        onClick={() => handleSelectPatient(patient)}
                                        className="bg-green-600 text-white px-4 py-2 rounded"
                                    >
                                        View Medical History
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No patients found.</p>
            )}

            {selectedPatient && (
                <div className="mt-6 p-4 border rounded shadow-md">
                    <h3 className="text-xl font-bold mb-4">
                        Medical History for {selectedPatient.firstname} {selectedPatient.lastname}
                    </h3>
                    <p><strong>Chronic Conditions:</strong> {selectedPatient.chronic_conditions || 'N/A'}</p>
                    <p><strong>Past Surgeries:</strong> {selectedPatient.past_surgeries || 'N/A'}</p>
                    <p><strong>Current Medications:</strong> {selectedPatient.current_medications || 'N/A'}</p>
                    <p><strong>Allergies:</strong> {selectedPatient.allergies || 'N/A'}</p>
                    <p><strong>Lifestyle Factors:</strong> {selectedPatient.lifestyle_factors || 'N/A'}</p>
                    <p><strong>Vaccination Status:</strong> {selectedPatient.vaccination_status || 'N/A'}</p>
                    <button
                        onClick={() => setSelectedPatient(null)}
                        className="bg-red-600 text-white px-4 py-2 rounded mt-4"
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};

export default ViewPatients;