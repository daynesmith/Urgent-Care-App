import { useContext} from 'react';
import {UserContext} from '../context/Usercontext';
import PatientDashboard from '../pages/PatientDashboard.jsx';
import AdminDashboard from '../pages/AdminDashboard.jsx';
import DoctorDashboard from '../pages/DoctorDashboard.jsx';
import SpecialistDashboard from '../pages/SpecialistDashboard.jsx';
import ReceptionistDashboard from '../pages/ReceptionistDashboard.jsx'


export default function Dashboard(){
    const {role} = useContext(UserContext)


    return(
        <div className = "bg-[#F8F9FA] m-4 p-8 shadow rounded-lg w-full mt-8">
            <h1 className="font-serif text-3xl text-center my-4">Welcome, {role}!</h1>
            {role === 'patient' && <PatientDashboard />}
            {role === 'admin' && <AdminDashboard />}
            {role === 'doctor' && <DoctorDashboard />}
            {role === 'receptionist' && <ReceptionistDashboard />}
            {role === 'specialist' && <SpecialistDashboard />}
            

        </div>
    )

}