import './styles/App.css'
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Homepage from './pages/Homepage.jsx'
function App() {

  return (
    <>  
      <Router>
        <div className = 'navbar'>
          <Link to= '/'>HomePage</Link>
          <Link to= '/'>HomePage</Link>
          
        </div>
        <div className = 'content'>
        <Routes>
          <Route path = '/' element = {<Homepage/>}/>
        </Routes>
        </div>
      </Router>    
    </>
  )
}

export default App
