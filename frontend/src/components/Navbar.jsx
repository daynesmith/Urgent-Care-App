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
          {/*links patients see*/}
          {role === 'patient' && (
            <>
            <Link to= '/dashboard'>Patient Dashboard</Link>

            </>
          )}
          {/*links Admin see*/}
          {role === 'admin' && (
            <>
            <Link to= '/dashboard'>Admin Dashboard</Link>

            </>
          )}
          {/*links doctors see*/}
          {role === 'doctor' && (
            <>
            <Link to= '/dashboard'>Doctor Dashboard</Link>

            </>
          )}
          {/*links Receptionists see*/}
          {role === 'receptionist' && (
            <>
            <Link to= '/dashboard'>Receptionist Dashboard</Link>

            </>
          )}
          {/*links logged in people dont see*/}
          {!role && (
            <>
            <Link to= '/'>HomePage</Link>
            <Link to= 'login'>Login</Link>
            <Link to= '/register'>Registration</Link>
            </>
          )}
          {/* logged in links everyone sees*/}
          {role && (
          <Link to= '/' onClick = {logout}>Click to Logout</Link>
          )}
        </div>
    )
}
