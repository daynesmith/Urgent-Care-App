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
import MedicalHistory from './pages/MedicalHistory.jsx';
import ReceptionistProfile from './pages/ReceptionistProfile.jsx';
import ReceptionistAppointment from './pages/ReceptionistAppoinment.jsx';

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
            <Route path = '/roleform' element = {<RoleForm/>}/>   {/*added for testing*/}
            <Route path = '/DoctorInfoForm' element = {<DoctorInfoForm/>}/>
            <Route path = '/visits' element = {<Visits />} />
            <Route path = '/ScheduleAppointment' element = {<ScheduleAppointment />} />
            <Route path = '/PatientInfo' element = {<PatientInfo />} />
            <Route path = '/medical-history' element = {<MedicalHistory />} />
            <Route path = '/ReceptionistProfile' element = {<ReceptionistProfile />} />
            <Route path = '/ReceptionistAppointment' element = {<ReceptionistAppointment />} />
          </Routes>
        </div>
      </Router>    
    </UserProvider>
    
  )
}

export default App
