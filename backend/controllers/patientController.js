const {Patients,Users} = require('../models');

const getIfPatientInfo = async (req,res) =>{
    const email = req.user.email

    try{
        const patientExists = await Patients.findOne({where:{email: email}})

        if(!patientExists){
            return res.status(200).json({formFilled: false})
        }

        return res.status(200).json({formFilled: true})
    }catch(error){
        console.error(error)
        res.status(500).json("error finding patient info")
    }
}

const inputPatientInfoForFirstTime = async (req, res) => {
    try {
        const { firstname, lastname, dateofbirth, phonenumber} = req.body;
        const email = req.user.email;  

        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Email not found." });
        }
        const patientid = user.userid;   

        console.log('Received data for patient profile creation:', { patientid, email, firstname, lastname, dateofbirth, phonenumber });

        if (!firstname || !lastname || !dateofbirth || !phonenumber) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // create the patient profile 
        const patient = await Patients.create({
            patientid,
            email,
            firstname,
            lastname,
            dateofbirth,
            phonenumber
        });

        console.log('Patient profile created:', patient);
        res.status(201).json({ message: "Patient profile created successfully", patient });

    } catch (error) {
        console.error("Error creating patient profile:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


const getPatientsNames = async (req, res) => {
    try {
        const patients = await Patients.findAll({
            attributes: ['patientid','firstname', 'lastname']
        });

        const patientNames = patients.map(patient => {
            return {
                patientid: patient.patientid, 
                name: `${patient.firstname} ${patient.lastname}`
            };
        });

        res.json(patientNames);  
    } catch (error) {
        console.error("Error fetching patients' names:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = {inputPatientInfoForFirstTime, getIfPatientInfo, getPatientsNames};