import './styles/App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Homepage from './pages/Homepage.jsx'
import Navbar from './components/Navbar.jsx'
import RegistrationForm from './pages/Registrationpage.jsx';
import LoginPage from './pages/Loginpage.jsx'


function App() {

  return (
    <>  
      <Router>
          <Navbar/>
        <div className = 'content'>
          <Routes>
            <Route path = '/' element = {<Homepage/>}/>
            <Route path = '/register' element = {<RegistrationForm/>}/>
            <Route path = '/login' element = {<LoginPage/>}/>
          </Routes>
        </div>
      </Router>    
    </>
  )
}

export default App
