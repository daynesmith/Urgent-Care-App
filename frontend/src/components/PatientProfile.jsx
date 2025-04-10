import { useState, useEffect } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL
import { jwtDecode } from 'jwt-decode';
import EditPatientProfile from './EditPatientProfile';



export default function PatientProfile(){
    // const token = props.token;

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [dateofbirth, setDateofbirth] = useState('');
    const [phonenumber, setPhonenumber] = useState('');

    useEffect(() => {
        const fetchPatientInfo = async () => {
            const token = localStorage.getItem('accessToken');
            
            if (!token) {
                setError("No access token found. Please log in again.");
                return;
            }
            try {
                const decoded = jwtDecode(token);  
                console.log(decoded);
                const response = await axios.get(`${apiUrl}/patient/patientinfo`,{
                    headers: {
                    'accessToken':token
                    }
                });

                console.log(response.data);
                if (response.data) {
                    if (response.data.firstname) {
                        setFirstname(response.data.firstname);
                    }
                    if (response.data.lastname) {
                        setLastname(response.data.lastname);
                    }
                    if (response.data.dateofbirth) {
                        const formattedDOB = new Date(response.data.dateofbirth).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long", // or "short" for "May"
                            day: "numeric",
                          });
                        setDateofbirth(formattedDOB);
                    }
                    if (response.data.phonenumber) {
                        setPhonenumber(response.data.phonenumber);
                    }
                } else {
                    console.log("No patient info found.");
                }
            } catch (err) {
                setError(err.message); 
            } finally {
                setLoading(false); 
            }
        };
        fetchPatientInfo();
    }, [isEditing]);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className = "bg-[#F8F9FA] m-4 p-8 shadow rounded-lg w-full mt-8">
            <h1 className="font-serif text-3xl text-center my-4">Patient Profile</h1>
            {isEditing ? (<EditPatientProfile setIsEditing={setIsEditing} firstname={firstname} lastname={lastname} dateofbirth={dateofbirth} phonenumber={phonenumber}
            setFirstname={setFirstname} setLastname={setLastname} setDateofbirth={setDateofbirth} setPhonenumber={setPhonenumber}/>) : 
            (
                <div className="bg-gray-200 p-2 grid-flow-row auto-rows-max">
                <div className="mb-1">
                    <h3 className="text-xl font-semibold">First Name</h3>
                    <p>{firstname}</p>
                </div>
                <div className="mb-1">
                    <h3 className="text-xl font-semibold">Last Name</h3>
                    <p>{lastname}</p>
                </div>
                <div className="mb-1">
                    <h3 className="text-xl font-semibold">Date of Birth</h3>
                    <p>{dateofbirth}</p>
                </div>
                <div className="mb-1">
                    <h3 className="text-xl font-semibold">Phone Number</h3>
                    <p>{phonenumber}</p>
                </div>
                <div className="mt-3"><button onClick={() => setIsEditing(true)} className="border bg-white shadow-lg rounded-lg w-20 p-2 cursor-pointer">Edit</button></div>
                </div>
            )}
            
        </div>
    );
}