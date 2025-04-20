import { useContext} from 'react';
import {UserContext} from '../context/Usercontext';
import PatientDashboard from '../components/PatientDashboard.jsx';
import AdminDashboard from '../components/AdminDashboard.jsx';
import DoctorDashboard from '../components/DoctorDashboard.jsx';
import ReceptionistDashboard from '../components/ReceptionistDashboard.jsx';
import SpecialistDashboard from '../components/SpecialistDashboard.jsx';
import NurseDashboard from '../components/NurseDashboard.jsx';


export default function Dashboard(){
    const {role} = useContext(UserContext)
    

    return(
        <div className = "bg-[#F8F9FA] m-4 p-8 shadow rounded-lg w-full mt-8" style={{
            marginTop: "0px",
            marginLeft: "0px",
            marginRight: "0px",
            marginBottom: "0px",
            paddingTop: "0px",
            paddingLeft: "0px",
            paddingRight: "0px",
            paddingBottom: "0px",
          }}
        >
            {role === 'receptionist' && <ReceptionistDashboard />}
            {role === 'patient' && <PatientDashboard />}
            {role === 'admin' && <AdminDashboard />}
            {role === 'doctor' && <DoctorDashboard />}
            {role === 'specialist' && <SpecialistDashboard />}
            {role === 'nurse' && <NurseDashboard />}
        </div>
    )
}