import { useState, useEffect } from 'react';
import EditMedicalHistoryForm from "./EditMedicalHistoryForm";
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL

export default function MedHistory(props){

    const token = props.token;
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chronicConditions, setchronicConditions] = useState([]);
    const [pastSurgeries, setPastSurgeries] = useState([]);
    const [currentMedications, setcurrentMedications] = useState([]);
    const [allergies, setAllergies] = useState([]);
    const [lifestyleFactors, setlifestyleFactors] = useState([]);
    const [vaccinationStatus, setVaccinationStatus] = useState([]);

    useEffect(() => {
        const fetchMedicalHistory = async () => {
            try {

                const response = await axios.get(`${apiUrl}/patient/medical-history`,{
                    headers: {
                    'accessToken':token
                    }
                });

                if (response.data) {
                    if (response.data.chronic_conditions) {
                        setchronicConditions(response.data.chronic_conditions.split(", "));
                    }
                    if (response.data.past_surgeries) {
                        setPastSurgeries(response.data.past_surgeries.split(", "));
                    }
                    if (response.data.current_medications) {
                        setcurrentMedications(response.data.current_medications.split(", "));
                    }
                    if (response.data.allergies) {
                        setAllergies(response.data.allergies.split(", "));
                    }
                    if (response.data.lifestyle_factors) {
                        setlifestyleFactors(response.data.lifestyle_factors.split(", "));
                    }
                    if (response.data.vaccination_status) {
                        setVaccinationStatus(response.data.vaccination_status.split(", "));
                    }
                } else {
                    console.log("No medical history found.");
                }
            } catch (err) {
                setError(err.message); 
            } finally {
                setLoading(false); 
            }
        };

        fetchMedicalHistory();
    }, [isEditing]); 

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    
    return (
        <div className="bg-gray-200 p-2 grid-flow-row auto-rows-max">
            {isEditing ? (
                <EditMedicalHistoryForm setIsEditing={setIsEditing} token={token} chronicConditions={chronicConditions}
                pastSurgeries={pastSurgeries} currentMedications={currentMedications} allergies={allergies} lifestyleFactors={lifestyleFactors}
                vaccinationStatus={vaccinationStatus} setchronicConditions={setchronicConditions} setPastSurgeries={setPastSurgeries} setcurrentMedications={setcurrentMedications}
                setAllergies={setAllergies} setlifestyleFactors={setlifestyleFactors} setVaccinationStatus={setVaccinationStatus}
                />
            ) : (<>
            <div className="mb-1">
                <h3 className="text-xl font-semibold">Chronic Conditions</h3>
                {chronicConditions.length > 0 ? (chronicConditions.map(data => <p>{data}</p>)) : (<p>No chronic conditions listed</p>)
                }
            </div>
            <div className="mb-1">
                <h3 className="text-xl font-semibold">Past Surgeries</h3>
                {pastSurgeries.length > 0 ? (pastSurgeries.map(data => <p>{data}</p>)) : (<p>No past surgeries listed</p>)
                }
            </div>
            <div className="mb-1">
                <h3 className="text-xl font-semibold">Current Medications</h3>
                {currentMedications.length > 0 ? (currentMedications.map(data => <p>{data}</p>)) : (<p>No current medications listed</p>)
                }
            </div>
            <div className="mb-1">
                <h3 className="text-xl font-semibold">Allergies</h3>
                {allergies.length > 0 ? (allergies.map(data => <p>{data}</p>)) : (<p>No allergies listed</p>)
                }
            </div>
            <div className="mb-1">
                <h3 className="text-xl font-semibold">Lifestyle Factors</h3>
                {lifestyleFactors.length > 0 ? (lifestyleFactors.map(data => <p>{data}</p>)) : (<p>No lifestyle factors listed</p>)
                }
            </div>
            <div className="mb-1">
                <h3 className="text-xl font-semibold">Vaccinations</h3>
                {vaccinationStatus.length > 0 ? (vaccinationStatus.map(data => <p>{data}</p>)) : (<p>No vaccinations listed</p>)
                }
            </div>
            <div className="mt-3"><button onClick={() => setIsEditing(true)} className="border bg-white shadow-lg rounded-lg w-20 p-2 cursor-pointer">Edit</button></div>
            </>
        )}
        </div>
        
    );
};

