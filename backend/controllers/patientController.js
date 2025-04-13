const { Patients, Users, Appointments } = require('../models');

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

const getPatientInfo = async (req, res) => {
    try {
        const patient = await Patients.findOne({
            where:{email: req.user.email},
            attributes: ["firstname", "lastname", "dateofbirth", "phonenumber"]
        })
            
        if (!patient) {
            return res.status(400).json({ message: "patient not found with token." });
        }

        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

// can't submit completely blank data
// fix how to edit date of birth

const editPatientInfo = async (req, res) => {

    const { email } = req.user;
    const {
        firstname,
        lastname,
        dateofbirth,
        phonenumber
    } = req.body

    try {
        const patient = await Patients.findOne({
            where:{email: email},
        })

        if (!patient) {
            return res.status(400).json({ message: "patient not found with token." });
        }

        await patient.update({
            firstname: firstname,
            lastname: lastname,
            dateofbirth: dateofbirth,
            phonenumber: phonenumber,
        });

        console.log("Database update successful:");
        res.json({ success: true });

    } catch (error) {
        console.error("Error updating patient info:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

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
        const appointments = await Appointments.findAll({
            attributes: ['patientid'],
            group: ['patientid']
        });

        const patientIds = appointments.map((appt) => appt.patientid);

        const patients = await Patients.findAll({
            where: { patientid: {
                [Op.in]: patientIds
            } },
            attributes: ['patientid', 'firstname', 'lastname']
        });

        const formatted = patients.map((p) => ({
            patientid: p.patientid,
            name: `${p.firstname} ${p.lastname}`
        }));

        res.json(formatted);
    } catch (error) {
        console.error("Error fetching filtered patient names:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

const getMedicalHistory = async (req, res) => {
    try {
        const patient = await Patients.findOne({
            where:{email: req.user.email},
            attributes: ["chronic_conditions", "past_surgeries", "current_medications", "allergies", "lifestyle_factors", "vaccination_status"]
        })
            
        if (!patient) {
            return res.status(400).json({ message: "patient not found with token." });
        }

        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

const editMedicalHistory = async (req, res) => {
    console.log("Received PATCH request:", req.body);
    const { email } = req.user;

    const {
        chronicConditions,
        pastSurgeries,
        currentMedications,
        allergies,
        lifestyleFactors,
        vaccinationStatus
    } = req.body

    try {
        const patient = await Patients.findOne({
            where:{email: email},
        })
        
        if (!patient) {
            return res.status(400).json({ message: "patient not found with token." });
        }

        await patient.update({
            chronic_conditions: chronicConditions ?? "",
            past_surgeries: pastSurgeries ?? "",
            current_medications: currentMedications ?? "",
            allergies: allergies ?? "",
            lifestyle_factors: lifestyleFactors ?? "",
            vaccination_status: vaccinationStatus ?? ""
        });

        console.log("Database update successful:");
        res.json({ success: true });

    } catch (error) {
        console.error("Error updating medical history:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getPatientsByDoctor = async (req, res) => {
    const doctorId = req.query.doctor_id;
    if (!doctorId) {
      return res.status(400).json({ error: 'Missing doctor_id' });
    }
  
    try {
      // Get all patient IDs from appointments with this doctor
      const appointments = await Appointments.findAll({
        where: { doctorid: doctorId },
        attributes: ['patientid'],
        group: ['patientid']
      });
  
      const patientIds = appointments.map((appt) => appt.patientid);
  
      if (patientIds.length === 0) {
        return res.json([]); // no patients yet
      }
  
      const patients = await Patients.findAll({
        where: { patientid: patientIds },
        attributes: [
            'patientid', 
            'firstname', 
            'lastname',
            'chronic_conditions',
            'past_surgeries',
            'current_medications',
            'allergies',    
            'lifestyle_factors',
            'vaccination_status'
        ]
      });
  
      res.json(patients);
    } catch (err) {
      console.error('Error fetching patients by doctor:', err);
      res.status(500).json({ error: 'Failed to fetch patients' });
    }
  };

  

module.exports = {
  inputPatientInfoForFirstTime,
  getIfPatientInfo,
  getPatientsNames,
  getMedicalHistory,
  editMedicalHistory, 
  getPatientInfo, 
  editPatientInfo,
  getPatientsByDoctor
};
