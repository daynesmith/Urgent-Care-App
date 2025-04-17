import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Building2, Clock, Save, Edit2 } from 'lucide-react';
const apiUrl = import.meta.env.VITE_API_URL;
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function ReceptionistProfile() {
    const [profile, setProfile] = useState({
        firstname: '',
        lastname: '',
        phonenumber: '',
        email: '',
      });
      
  const [isEditing, setIsEditing] = useState(false);
  const [formFilled, setFormFilled] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    const checkReceptionistInfo = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError("No access token found. Please log in again.");
            return;
        }
        try {
            const decoded = jwtDecode(token);  
            console.log("Decoded Token:", decoded);
            
            // Make sure you're calling the API correctly
            const response = await axios.get(`${apiUrl}/receptionist/checkreceptionisttable`, {
                headers: { 
                    'accessToken': token
                }
            });
            
            console.log('Receptionist Info Response:', response.data);
            
            // Ensure the structure of response.data is correct
            if (response.data.formFilled) {
                setProfile({
                    firstname: response.data.receptionist.firstname || '',
                    lastname: response.data.receptionist.lastname || '',
                    phonenumber: response.data.receptionist.phonenumber || '',
                    email: response.data.receptionist.email || ''
                });
            } else {
                setFormFilled(false); // Handle case where form is not filled
            }

        } catch (error) {
            console.error('Error checking receptionist info:', error);
            setError('Failed to verify receptionist information.');
        }
    };

    checkReceptionistInfo();
}, []);

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting profile:", profile); // Log the data being sent
    const token = localStorage.getItem('accessToken');
    if (!token) {
        setError("No access token found. Please log in again.");
        return;
    }
    try {
        const decoded = jwtDecode(token);  
        console.log("Decoded Token:", decoded);
        const response = await axios.post(
        `${apiUrl}/receptionist/updateprofile`,
        profile,
        {
            headers: { 
                'accessToken': token
            }
        }
      );
      console.log('Profile update successful:', response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };
  
  
  

  return (
    <div className="min-h-screen bg-white-50">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-10">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center">
                            <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center">
                                <User className="h-12 w-12 text-blue-500" />
                            </div>
                            <div className="ml-6">
                                <h1 className="text-2xl font-bold text-white">Receptionist Profile</h1>
                                <p className="text-blue-100">Manage your professional information</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="bg-white text-blue-600 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-50 transition-colors"
                        >
                            {isEditing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                            {isEditing ? 'Save Changes' : 'Edit Profile'}
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-8 py-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* First Name */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
                                <User className="h-4 w-4 text-gray-400" />
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstname"
                                value={profile.firstname}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50 disabled:text-gray-500"
                            />
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
                                <User className="h-4 w-4 text-gray-400" />
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastname"
                                value={profile.lastname}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50 disabled:text-gray-500"
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phonenumber"
                                value={profile.phonenumber}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50 disabled:text-gray-500"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50 disabled:text-gray-500"
                            />
                        </div>
                    </div>

                    {/* Save Button */}
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {status && <div className="text-green-500 text-sm">{status}</div>}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={!isEditing} // Disable the submit button if not in editing mode
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-8 py-4 bg-gray-50">
                    <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    </div>
);
}

