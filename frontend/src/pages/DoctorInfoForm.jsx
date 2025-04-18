import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import DoctorProfile from '../components/DoctorProfile';
import { X } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL;

export default function DoctorInfoForm() {
    const navigate = useNavigate();
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [dateofbirth, setDateofbirth] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    const [formFilled, setFormFilled] = useState(false);
    const [doctorData, setDoctorData] = useState(null); // Store the doctor data for display

    // Check if the doctor already has info filled
    useEffect(() => {
        const checkDoctorInfo = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError("No access token found. Please log in again.");
                return;
            }
            try {
                const decoded = jwtDecode(token);  
                console.log("Decoded Token:", decoded);

                const response = await axios.post(`${apiUrl}/doctor/checkdoctortable`, {}, {
                    headers: { 'accessToken': token }
                });

                console.log("Doctor Info Response:", response.data);
                setFormFilled(response.data.formFilled);

                if (response.data.formFilled) {
                    // If form is filled, store the doctor's data to show on the UI
                    setDoctorData(response.data.doctorInfo);
                }
            } catch (error) {
                console.error('Error checking doctor info:', error);
                setError('Failed to verify doctor information.');
            }
        };
        checkDoctorInfo();
    }, []);

    const handleCancel = () => {
        navigate('/dashboard'); 
      };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form filled state:", formFilled);

        if (formFilled) {
            setError('Doctor profile already exists. Use the update button to make changes.');
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

            const doctorData = {
                firstname,
                lastname,
                dateofbirth: `${dateofbirth} 00:00:00`, 
                phonenumber,
            };

            console.log('Doctor data being sent:', doctorData);

            await axios.post(`${apiUrl}/doctor/inputdoctorinfo`, doctorData, {
                headers: { 'accessToken': token },
            });

            setStatus('Doctor profile successfully created!');
            setFirstname('');
            setLastname('');
            setDateofbirth('');
            setPhonenumber('');
        } catch (error) {
            console.error('Error creating doctor profile:', error);
            setError('Failed to create doctor profile.');
        }
    };

    useEffect(() => {
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
    }, [phonenumber]);
    
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-100">
            <div className="bg-white shadow-xl rounded-lg p-6 w-96">
            <button
                onClick={handleCancel}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-50"
                >
                <X className="h-6 w-6" />
            </button>

                <h2 className="text-2xl font-bold text-center mb-4">Doctor Profile</h2>

                {formFilled ? (
                    <DoctorProfile doctorData={doctorData} />
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input 
                            type="text" 
                            placeholder="First Name" 
                            value={firstname} 
                            onChange={(e) => setFirstname(e.target.value)} 
                            className="w-full border p-2 rounded" 
                        />

                        <input 
                            type="text" 
                            placeholder="Last Name" 
                            value={lastname} 
                            onChange={(e) => setLastname(e.target.value)} 
                            className="w-full border p-2 rounded" 
                        />

                    <label className="block font-medium">Date of Birth</label>
                    <input type="date" value={dateofbirth} onChange={(e) => setDateofbirth(e.target.value)} className="w-full border p-2 rounded" />

                        <input 
                            type="text" 
                            placeholder="Phone Number" 
                            value={phonenumber} 
                            onChange={(e) => setPhonenumber(e.target.value)} 
                            className="w-full border p-2 rounded" 
                        />

                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        {status && <div className="text-green-500 text-sm">{status}</div>}

                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition">
                            Create Profile
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

