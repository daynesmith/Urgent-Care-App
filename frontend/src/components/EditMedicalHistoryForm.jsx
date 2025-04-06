import { useState } from "react";
import axios, { all } from 'axios';
const apiUrl = import.meta.env.VITE_API_URL

export default function EditMedicalHistoryForm(props){

    const token =  props.token ;
    
    const [chronicConditions, setchronicConditions] = useState(props.chronicConditions);
    const [pastSurgeries, setPastSurgeries] = useState(props.pastSurgeries);
    const [currentMedications, setcurrentMedications] = useState(props.currentMedications);
    const [allergies, setAllergies] = useState(props.allergies);
    const [lifestyleFactors, setlifestyleFactors] = useState(props.lifestyleFactors);
    const [vaccinationStatus, setVaccinationStatus] = useState(props.vaccinationStatus);



    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = JSON.stringify({
            chronicConditions: Array.isArray(chronicConditions) ? chronicConditions.join(", ") : chronicConditions,
            pastSurgeries: Array.isArray(pastSurgeries) ? pastSurgeries.join(", ") : pastSurgeries,
            currentMedications: Array.isArray(currentMedications) ? currentMedications.join(", ") : currentMedications,
            allergies: Array.isArray(allergies) ? allergies.join(", ") : allergies,
            lifestyleFactors: Array.isArray(lifestyleFactors) ? lifestyleFactors.join(", ") : lifestyleFactors,
            vaccinationStatus: Array.isArray(vaccinationStatus) ? vaccinationStatus.join(", ") : vaccinationStatus,
        })

        try {
            const response = await axios.patch(`${apiUrl}/patient/medical-history`, updatedData, {
                    headers: {
                    'accessToken':token,
                    'Content-Type': 'application/json'
                    },
                    timeout: 5000
                });

                
                props.setchronicConditions([...chronicConditions]);
                props.setPastSurgeries([...pastSurgeries]);
                props.setcurrentMedications([...currentMedications]);
                props.setAllergies([...allergies]);
                props.setlifestyleFactors([...lifestyleFactors]);
                props.setVaccinationStatus([...vaccinationStatus]);
                props.setIsEditing(false);
            
        } catch (err) {
            console.error("Fetch error:", err);
        } 

    }

    return (
            <form onSubmit={handleSubmit}>
            <div>
                <label>Chronic Conditions:</label>
                <input
                    className="w-full border"
                    type="text"
                    value={chronicConditions}
                    onChange={(e) => setchronicConditions(e.target.value)}
                />
            </div>

            <div>
                <label>Past Surgeries:</label>
                <input
                    className="w-full border"
                    type="text"
                    value={pastSurgeries}
                    onChange={(e) => setPastSurgeries(e.target.value)}
                />
            </div>

            <div>
                <label>Current Medications:</label>
                <input
                    className="w-full border"
                    type="text"
                    value={currentMedications}
                    onChange={(e) => setcurrentMedications(e.target.value)}
                />
            </div>

            <div>
                <label>Allergies:</label>
                <input
                    className="w-full border"
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                />
            </div>

            <div>
                <label>Lifestyle Factors:</label>
                <input
                    className="w-full border"
                    type="text"
                    value={lifestyleFactors}
                    onChange={(e) => setlifestyleFactors(e.target.value)}
                />
            </div>

            <div>
                <label>Vaccinations:</label>
                <input
                    className="w-full border"
                    type="text"
                    value={vaccinationStatus}
                    onChange={(e) => setVaccinationStatus(e.target.value)}
                />
            </div>

            <div>
                <button className="border bg-white shadow-lg rounded-lg w-20 p-2 cursor-pointer" type="submit">Save</button>
                <button className="border bg-white shadow-lg rounded-lg w-20 p-2 cursor-pointer" type="button" onClick={() => props.setIsEditing(false)}>
                    Cancel
                </button>
            </div>
        </form>
    );
}