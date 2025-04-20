import { useState, useEffect } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL
import { jwtDecode } from 'jwt-decode';
import EditDoctorProfile from './EditDoctorProfile';



export default function DoctorProfile(props){

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const [firstname, setFirstname] = useState(props.doctorData.firstname);
    const [lastname, setLastname] = useState(props.doctorData.lastname);
    const [dateofbirth, setDateofbirth] = useState(props.doctorData.dateofbirth);
    const [phonenumber, setPhonenumber] = useState(props.doctorData.phonenumber);

    useEffect(() => {
        const fetchDoctorInfo = async () => {
            const token = localStorage.getItem('accessToken');
            
            if (!token) {
                setError("No access token found. Please log in again.");
                return;
            }
            try {
                const decoded = jwtDecode(token);  

                const response = await axios.post(`${apiUrl}/doctor/checkdoctortable`, {}, {
                    headers: { 'accessToken': token }
                });

                console.log(response.data);
                if (response.data.formFilled) {
                    if (response.data.doctorInfo.firstname) {
                        setFirstname(response.data.doctorInfo.firstname);
                    }
                    if (response.data.doctorInfo.lastname) {
                        setLastname(response.data.doctorInfo.lastname);
                    }
                    if (response.data.doctorInfo.dateofbirth) {
                        const formattedDOB = new Date(response.data.doctorInfo.dateofbirth).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long", // or "short" for "May"
                            day: "numeric",
                          });
                        setDateofbirth(formattedDOB);
                    }
                    if (response.data.doctorInfo.phonenumber) {
                        setPhonenumber(response.data.doctorInfo.phonenumber);
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
        fetchDoctorInfo();
    }, [isEditing]);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
        {isEditing ? (<EditDoctorProfile setIsEditing={setIsEditing} firstname={firstname} lastname={lastname} dateofbirth={dateofbirth} phonenumber={phonenumber}
            setFirstname={setFirstname} setLastname={setLastname} setDateofbirth={setDateofbirth} setPhonenumber={setPhonenumber} />) :
             (
            <div className="space-y-4">
            <div><strong>First Name:</strong> {firstname}</div>
            <div><strong>Last Name:</strong> {lastname}</div>
            <div><strong>Date of Birth:</strong> {dateofbirth}</div>
            <div><strong>Phone Number:</strong> {phonenumber}</div>
            <div className="mt-3"><button onClick={() => setIsEditing(true)} className="border bg-white shadow-lg rounded-lg w-20 p-2 cursor-pointer">Edit</button></div>
        </div>
        )}
        </>
    );
}

