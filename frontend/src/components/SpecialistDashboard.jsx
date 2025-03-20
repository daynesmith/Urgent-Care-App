import { Link } from 'react-router-dom';

export default function SpecialistDashboard(){
    return(
    <div className="flex justify-center flex-row flex-nowrap gap-2 text-sm font-mono">
        {/* will need to add links to all buttons later */}
        <Link as={Link} className="border rounded-l shadow-lg p-3 h-full text-center min-w-3xs"><h4>Incoming Requests</h4> </Link> 
    </div>
    )
}