import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const apiUrl = import.meta.env.VITE_API_URL;

export default function PatientInfo() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [dateofbirth, setDateofbirth] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    const [formFilled, setFormFilled] = useState(false);

    useEffect(() => {
        const checkPatientInfo = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError("No access token found. Please log in again.");
                return;
            }
            try {
                const decoded = jwtDecode(token);  
                console.log("Decoded Token:", decoded);
                
                const response = await axios.post(`${apiUrl}/patient/checkpatienttable`, {}, {
                    headers: { 
                        'accessToken': token
                     }
                });
                console.log("Patient Info Response:", response.data);
                setFormFilled(response.data.formFilled);
            } catch (error) {
                console.error('Error checking patient info:', error);
                setError('Failed to verify patient information.');
            }
        };
        checkPatientInfo();
    }, []);

    useEffect(() => {
        console.log("formFilled state:", formFilled);
    }, [formFilled]); // Log whenever formFilled changes

    useEffect(() => {
        // Format phone number to nnn-nnn-nnnn
        const formatPhoneNumber = (value) => {
            // Remove non-numeric characters
            let formattedValue = value.replace(/[^\d]/g, '');
            
            if (formattedValue.length > 10) {
                formattedValue = formattedValue.slice(0, 10);
            }

            if (formattedValue.length <= 3) {
                formattedValue = formattedValue.replace(/(\d{0,3})/, '$1');
            } else if (formattedValue.length <= 6) {
                formattedValue = formattedValue.replace(/(\d{3})(\d{0,3})/, '$1-$2');
            } else {
                formattedValue = formattedValue.replace(/(\d{3})(\d{3})(\d{0,4})/, '$1-$2-$3');
            }
            return formattedValue;
        };

        setPhonenumber(formatPhoneNumber(phonenumber));
    }, [phonenumber]); // Runs whenever phonenumber state changes

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form filled state:", formFilled);
        if (formFilled) {
            setError('Patient profile already exists. Use the update button to make changes.');
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
            const decoded = jwtDecode(token);
            console.log("Decoded Token:", decoded);

            if (!decoded.email) {
                setError("Invalid token structure: missing email.");
                return;
            }

            const patientData = {
                firstname,
                lastname,
                dateofbirth: `${dateofbirth} 00:00:00`, 
                phonenumber
            };

            console.log('Patient data being sent:', patientData);

            await axios.post(`${apiUrl}/patient/inputpatientinfo`, patientData, {
                headers: { 'accessToken': token },
            });

            setStatus('Patient profile successfully created!');
            setFirstname('');
            setLastname('');
            setDateofbirth('');
            setPhonenumber('');
        } catch (error) {
            console.error('Error creating patient profile:', error);
            setError('Failed to create patient profile.');
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-100">
            <div className="bg-white shadow-xl rounded-lg p-6 w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Create Patient Profile</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="First Name" value={firstname} onChange={(e) => setFirstname(e.target.value)} className="w-full border p-2 rounded" />

                    <input type="text" placeholder="Last Name" value={lastname} onChange={(e) => setLastname(e.target.value)} className="w-full border p-2 rounded" />

                    <label className="block font-medium">Date of Birth</label>
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
