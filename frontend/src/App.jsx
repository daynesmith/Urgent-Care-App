import './styles/App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Homepage from './pages/Homepage.jsx'
import Navbar from './components/Navbar.jsx'
import RegistrationForm from './pages/Registrationpage.jsx';
import LoginPage from './pages/Loginpage.jsx'
import Dashboard from './pages/Dashboard.jsx';
import { UserProvider } from './context/Usercontext.jsx'
import RoleForm from './pages/RoleForm.jsx';
import PatientAppointment from './components/PatientAppointment.jsx';
import DoctorInfoForm from './pages/DoctorInfoForm.jsx'


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
            <Route path = '/PatientAppointment' element = {<PatientAppointment/>}/>
            <Route path = '/fill-doctor-form' element = {<DoctorInfoForm/>}/>
          </Routes>
        </div>
      </Router>    
    </UserProvider>
    
  )
}

export default App
