import { useContext} from 'react';
import {UserContext} from '../context/Usercontext';
import PatientDashboard from '../components/PatientDashboard.jsx';
import AdminDashboard from '../components/AdminDashboard.jsx';
import DoctorDashboard from '../components/DoctorDashboard.jsx';
import ReceptionistDashboard from '../components/ReceptionistDashboard.jsx';

export default function Dashboard(){
    const {role, setRole} = useContext(UserContext)


    return(
        <div className = "bg-[#F8F9FA] m-4 p-8 shadow rounded-lg w-full mt-8">
            <h1 className="font-serif text-3xl text-center my-4">Welcome, {role}!</h1>
            {role === 'receptionist' && <ReceptionistDashboard />}
            {role === 'patient' && <PatientDashboard />}
            {role === 'admin' && <AdminDashboard />}
            {role === 'doctor' && <DoctorDashboard />}
        </div>
    )

}