import { Link } from 'react-router-dom';

export default function Navbar(){
    return(
        <div className = 'navbar'>
          <Link to= '/'>HomePage</Link>
          <Link to= 'login'>Login</Link>
          <Link to= '/register'>Registration</Link>
        </div>
    )
}
