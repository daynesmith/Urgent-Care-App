import './styles/App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Homepage from './pages/Homepage.jsx'
import Navbar from './components/Navbar.jsx'
import RegistrationForm from './pages/Registrationpage.jsx';
import LoginPage from './pages/Loginpage.jsx'
import Dashboard from './pages/Dashboard.jsx';
import { UserProvider } from './context/Usercontext.jsx'
import RoleForm from './pages/RoleForm.jsx';
import ScheduleAppointment from './pages/ScheduleAppointment.jsx';
import DoctorInfoForm from './pages/DoctorInfoForm.jsx';
import Visits from './pages/Visits.jsx';
import PatientInfo from './pages/PatientInfo.jsx';
import DoctorAppointments from './pages/DoctorAppointments.jsx';
import MedicalHistory from './pages/MedicalHistory.jsx';
import ReceptionistProfile from './pages/ReceptionistProfile.jsx';
import ReceptionistAppointment from './pages/ReceptionistAppoinment.jsx';

import DoctorPatients from './pages/DoctorPatients.jsx';
import CreateReferral from './pages/CreateReferral.jsx'
import CheckInCheckOut from './pages/CheckInCheckOut.jsx';
import SpecialistDashboard from './components/SpecialistDashboard.jsx';
import JobOpenings from './components/JobOpenings.jsx';
import JoinTheTeam from './pages/JoinTheTeam.jsx'
import ApplicationForm from './components/ApplicationForm.jsx';
import AdminDasboard from './components/AdminDashboard.jsx';

import SingleAppointment from './pages/SingleAppointment.jsx';
import PatientBilling from './pages/PatientBilling.jsx';



function App() {

  
  return (

    <UserProvider>  
      <Router>
          <Navbar/>
        <div className="flex justify-center content-center">
          <Routes>
            <Route path = '/' element = {<Homepage/>}/>
            <Route path = '/register' element = {<RegistrationForm/>}/>
            <Route path = '/login' element = {<LoginPage/>}/>
            <Route path = '/dashboard' element = {<Dashboard/>}/>
            <Route path = '/roleform' element = {<RoleForm/>}/>   
            <Route path = '/DoctorInfoForm' element = {<DoctorInfoForm/>}/>
            <Route path = '/visits' element = {<Visits />} />
            <Route path = '/ScheduleAppointment' element = {<ScheduleAppointment />} />
            <Route path = '/PatientInfo' element = {<PatientInfo />} />
            <Route path = '/DoctorAppointments' element = {<DoctorAppointments />} />
            <Route path = '/medical-history' element = {<MedicalHistory />} />
            <Route path = '/ReceptionistProfile' element = {<ReceptionistProfile />} />
            <Route path = '/ReceptionistAppointment' element = {<ReceptionistAppointment />} />

            <Route path = '/DoctorPatients' element = {<DoctorPatients />} />
            <Route path = '/createreferral' element = {<CreateReferral/> } />
            <Route path = '/CheckInCheckOut' element = {<CheckInCheckOut />} />
            <Route path = '/JoinTheTeam' element = {<JoinTheTeam />} />
            <Route path = '/JobOpenings' element = {<JobOpenings />} />
            <Route path = '/ApplicationForm' element = {<ApplicationForm />} />
            <Route path = '/AdminDasboard' element = {<AdminDasboard />} />

            <Route path = '/visits/:apptid' element = {<SingleAppointment />} />
            <Route path = '/patient-billing' element = {<PatientBilling />}/>

          </Routes>
        </div>
      </Router>    
    </UserProvider>
    
  )
}

export default App
