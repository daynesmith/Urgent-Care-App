import { Link } from 'react-router-dom';
import { useContext} from 'react';
import {UserContext} from '../context/Usercontext';

export default function Navbar(){
    
    const {role, setRole} = useContext(UserContext)


    const logout=()=>{
      localStorage.clear();
      setRole(null)
    }
    
    return(
        <div className = 'navbar'>

          {role === 'patient' && (
            <>
            <Link to= '/dashboard'>Patient Dashboard</Link>

            </>
          )}
          {role === 'admin' && (
            <>
            <Link to= '/dashboard'>Admin Dashboard</Link>
            <Link to = '/roleform'>Change User Role</Link>
            </>
          )}

          {role === 'doctor' && (
            <>
            <Link to= '/dashboard'>Doctor Dashboard</Link>
            <Link to= '/createreferral'>Create Referral</Link>

            </>
          )}

          {role === 'receptionist' && (
            <>
            <Link to= '/dashboard'>Receptionist Dashboard</Link>

            </>
          )}
          {role === 'specialist' && (
            <>
            <Link to= '/dashboard'>Specialist Dashboard</Link>
            </>
          )}

          {!role && (
            <>
            <Link to= '/'>HomePage</Link>
            <Link to= 'login'>Login</Link>
            <Link to= '/register'>Registration</Link>
            </>
          )}

          {role && (
          <Link to= '/' onClick = {logout}>Click to Logout</Link>
          )}
        </div>
    )
}

