import { useState } from 'react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const RoleForm = () => {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const accessToken = localStorage.getItem('accessToken'); // retrieve access token from login?
      if (!accessToken) {
        setError('Access token not found. Please log in again.');
        return;
      }
  
      const response = await axios.post(
        `${apiUrl}/admin/to${role}`, 
        { email }, 
        
        {
          headers: { 
            accessToken: accessToken  // passing token through header
          }
        }
      );
  
      console.log('Role updated successfully:', response.data);
      alert('Role updated successfully');
    } catch (error) {
      setError(error.response?.data || 'An error occurred');
      console.error('Error updating role:', error);
    }
  };
  

  return (
    <div className="bg-[#F8F9FA] m-4 p-8 shadow rounded-lg sm:mx-auto sm:w-full sm:max-w-md mt-8">
      <h2 className="text-4xl font-serif text-center mb-8">Update User Role</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-1">
            Role:
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border-2 border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-sky-500 focus:border-sky-500 my-2"
            required
          >
            <option value="">Select a Role</option>
            <option value="doctor">Doctor</option>
            <option value="receptionist">Receptionist</option>
            <option value="admin">Admin</option>
            <option value="specialist">Specialist</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter user email"
            className="w-full border-2 border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-sky-500 focus:border-sky-500 my-2"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border mt-4 border-transparent rounded-md shadow-sm text-sm font-medium bg-[#17A2B8] hover:bg-[#0e7180] focus:outline-none"
        >
          Update Role
        </button>
      </form>
    </div>
  );
};

export default RoleForm;
