const Patient = require('../models/Patients'); 

const getPatientData = async (req, res) => {
    try {
        // Use patientid from token (req.user is set by the validateToken middleware) 
        const patientId = req.user.patientid; 
        
        const patient = await Patient.findById(patientId); //query the patient data using the patientid!
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        // send patient data back to the client 
        res.json(patient);
    } catch (error) {
        console.error('Error fetching patient data:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getPatientData };
