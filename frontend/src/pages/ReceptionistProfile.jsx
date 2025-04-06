import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaConciergeBell } from 'react-icons/fa';

const apiUrl = import.meta.env.VITE_API_URL;

export default function ReceptionistProfile() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [dateofbirth, setDateofbirth] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    const [formFilled, setFormFilled] = useState(false);

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
                
                const response = await axios.post(`${apiUrl}/receptionist/checkreceptionisttable`, {}, {
                    headers: { 
                        'accessToken': token
                    }
                });
                console.log("Receptionist Info Response:", response.data);
                setFormFilled(response.data.formFilled);
            } catch (error) {
                console.error('Error checking receptionist info:', error);
                setError('Failed to verify receptionist information.');
            }
        };
        checkReceptionistInfo();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formFilled) {
            setError('Receptionist profile already exists. Use the update button to make changes.');
            return;
        }
        if (!firstname || !lastname || !dateofbirth || !phonenumber) {
            setError('All fields are required.');
            return;
        }
        setError('');

        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError("No access token found. Please log in again.");
            return;
        }

        try {
            const receptionistData = {
                firstname,
                lastname,
                dateofbirth: `${dateofbirth} 00:00:00`, 
                phonenumber,
            };

            console.log('Receptionist data being sent:', receptionistData);

            await axios.post(`${apiUrl}/receptionist/inputreceptionistinfo`, receptionistData, {
                headers: { 'accessToken': token },
            });

            setStatus('Receptionist profile successfully created!');
            setFirstname('');
            setLastname('');
            setDateofbirth('');
            setPhonenumber('');
        } catch (error) {
            console.error('Error creating receptionist profile:', error);
            setError('Failed to create receptionist profile.');
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-100">
            <div className="bg-white shadow-xl rounded-lg p-6 w-96">
                <h2 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
                    <FaConciergeBell /> Create Receptionist Profile
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="First Name" value={firstname} onChange={(e) => setFirstname(e.target.value)} className="w-full border p-2 rounded" />

                    <input type="text" placeholder="Last Name" value={lastname} onChange={(e) => setLastname(e.target.value)} className="w-full border p-2 rounded" />

                    <input type="date" value={dateofbirth} onChange={(e) => setDateofbirth(e.target.value)} className="w-full border p-2 rounded" />

                    <input type="text" placeholder="Phone Number" value={phonenumber} onChange={(e) => setPhonenumber(e.target.value)} className="w-full border p-2 rounded" />

                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {status && <div className="text-green-500 text-sm">{status}</div>}
                    
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition">
                        Create Profile
                    </button>
                </form>
            </div>
        </div>
    );
}