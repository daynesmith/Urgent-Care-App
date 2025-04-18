import { useState, useEffect } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL
import { jwtDecode } from 'jwt-decode';

export default function EditDoctorProfile(props){

    const [firstname, setFirstname] = useState(props.firstname);
    const [lastname, setLastname] = useState(props.lastname);
    const [dateofbirth, setDateofbirth] = useState(props.dateofbirth);
    const [phonenumber, setPhonenumber] = useState(props.phonenumber);    
    const [error, setError] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!firstname || !lastname || !dateofbirth || !phonenumber ) {
            setError('All fields are required.');
            return;
        }
        setError('');

        const token = localStorage.getItem('accessToken');

        const updatedData = JSON.stringify({
            firstname,
            lastname,
            dateofbirth,
            phonenumber,
        })

        try {
            const response = await axios.patch(`${apiUrl}/doctor/doctorinfo`, updatedData, {
                    headers: {
                    'accessToken':token,
                    'Content-Type': 'application/json'
                    },
                });

                
                props.setFirstname(firstname);
                props.setLastname(lastname);
                props.setDateofbirth(dateofbirth);
                props.setPhonenumber(phonenumber);
                props.setIsEditing(false);
            
        } catch (err) {
            console.error("Fetch error:", err);
        } 

    }

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
    }, [phonenumber]);

    return (
        <form onSubmit={handleSubmit}>
        <div>
            <label>First Name</label>
            <input
                className="w-full border"
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
            />
        </div>

        <div>
            <label>Last Name</label>
            <input
                className="w-full border"
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
            />
        </div>

        <div>
            <label>Date of Birth</label>
            <input
                className="w-full border"
                type="date"
                value={dateofbirth}
                onChange={(e) => setDateofbirth(e.target.value)}
            />
        </div>

        <div>
            <label>Phone Number</label>
            <input
                className="w-full border"
                type="text"
                value={phonenumber}
                onChange={(e) => setPhonenumber(e.target.value)}
            />
        </div>


        <div>
            <button className="border bg-white shadow-lg rounded-lg w-20 p-2 cursor-pointer" type="submit">Save</button>
            <button className="border bg-white shadow-lg rounded-lg w-20 p-2 cursor-pointer" type="button" onClick={() => props.setIsEditing(false)}>
                Cancel
            </button>
        </div>
    </form>
    );
}