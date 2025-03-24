const { Appointments , Patients  } = require('../models'); 

const getPatientAppointments = async (req, res) => {
    try {

        const patient = await Patients.findOne({where:{email: req.user.email}})
            

        if (!patient) {
            return res.status(400).json({ message: "patient not found with token." });
        }

        const appointments = await Appointments.findAll({
            where: { patientid: patient.dataValues.patientid }
        });

        if (!appointments.length) {
            return res.status(404).json({ message: "No appointments found for this patient." });
        }

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

module.exports = { getPatientAppointments };