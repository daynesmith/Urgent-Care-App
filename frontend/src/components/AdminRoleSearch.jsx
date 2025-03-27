import { useState } from 'react';
import axios from 'axios';

export default function AdminRoleSearch() {
const [role, setRole] = useState('');
const [results, setResults] = useState([]);
const [firstName, setFirstName] = useState('');
const [specialtyOrDepartment, setSpecialtyOrDepartment] = useState('');


const handleSearch = async () => {
    if (!role) return;
  
    const apiBase = import.meta.env.VITE_API_URL;
  
    try {
      const res = await axios.get(`${apiBase}/admin/search`, {
        params: {
          role,
          firstname: firstName || undefined,
          specialty: specialtyOrDepartment || undefined,
        },
        withCredentials: true,
      });
      console.log("Fetched results:", res.data);
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Search error:", error);
      alert("An error occurred while searching.");
    }
  };

  return (
    <div className="admin-search p-4 border rounded-lg max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Search Users by Role</h2>
  
      <div className="flex flex-col gap-4 mb-4">
        {/* Role dropdown */}
        <div className="flex gap-2 items-center">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select a role</option>
            <option value="doctor">Doctors</option>
            <option value="specialist">Specialists</option>
            <option value="receptionist">Receptionists</option>
          </select>
  
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>
  
        {/* Filters for name and specialty/department */}
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="p-2 border rounded"
        />
  
        {role === 'doctor' && (
          <input
            type="text"
            placeholder="Specialty"
            value={specialtyOrDepartment}
            onChange={(e) => setSpecialtyOrDepartment(e.target.value)}
            className="p-2 border rounded"
          />
        )}
  
        {role === 'specialist' && (
          <input
            type="text"
            placeholder="Department"
            value={specialtyOrDepartment}
            onChange={(e) => setSpecialtyOrDepartment(e.target.value)}
            className="p-2 border rounded"
          />
        )}
      </div>
  
      {/* Results */}
      <div className="results space-y-2">
        {results.length > 0 ? (
          results.map((user, index) => (
            <div
              key={user.id || user.userid || index}
              className="p-2 border-b"
            >
              <p><strong>Name:</strong> {user.firstname} {user.lastname}</p>
              {user.email && <p><strong>Email:</strong> {user.email}</p>}
              {user.doctortype && <p><strong>Specialty:</strong> {user.doctortype}</p>}
              {user.specialty && <p><strong>Specialty:</strong> {user.specialty}</p>}
              {user.department && <p><strong>Department:</strong> {user.department}</p>}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No results</p>
        )}
      </div>
    </div>);
    }
  