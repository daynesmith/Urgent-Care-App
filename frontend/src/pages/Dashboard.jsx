import { useContext} from 'react';
import {UserContext} from '../context/Usercontext';
import PatientDashboard from '../components/PatientDashboard.jsx';
import AdminDashboard from '../components/AdminDashboard.jsx';
import DoctorDashboard from '../components/DoctorDashboard.jsx';
import ReceptionistDashboard from '../components/ReceptionistDashboard.jsx';
import SpecialistDashboard from '../components/SpecialistDashboard.jsx';


export default function Dashboard(){
    const {role} = useContext(UserContext)


    return(
        <div className = "bg-[#F8F9FA] m-4 p-8 shadow rounded-lg w-full mt-8">
            {role === 'receptionist' && <ReceptionistDashboard />}
            {role === 'patient' && <PatientDashboard />}
            {role === 'admin' && <AdminDashboard />}
            {role === 'doctor' && <DoctorDashboard />}
            {role === 'receptionist' && <ReceptionistDashboard />}
            {role === 'specialist' && <SpecialistDashboard />}
        </div>
    )
}