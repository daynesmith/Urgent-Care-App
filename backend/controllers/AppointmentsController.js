const { Appointments , Patients, Receptionists } = require('../models'); 

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

const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointments.findAll();
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const isDoctorAvailable = async (doctorid, requesteddate, requestedtime, appointmentid = null) => {
    const conflictCondition = {
        doctorid,
        requesteddate,
        requestedtime,
    };

    //exclude current appointment when checking
    if (appointmentid) {
        conflictCondition.appointmentid = { $ne: appointmentid };
    }

    const conflictingAppointment = await Appointments.findOne({
        where: conflictCondition,
    });

    //return true if no conflict
    return conflictingAppointment ? false : true;
};

const createAppointment = async (req, res) => {
    try {
        const { doctorid, requesteddate, requestedtime } = req.body;
        const patient = await Patients.findOne({ where: { email: req.user.email } });

        if (!patient) {
            return res.status(400).json({ message: "patient not authenticated or not found." });
        }
        const patientid = patient.dataValues.patientid;  
 
        //log received data 
        console.log('Received data for appointment creation:', { doctorid, requesteddate, requestedtime, patientid });

        // Check if all required fields are provid
        if (!doctorid || !requesteddate || !requestedtime || !patientid) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Check doctor availability
        const available = await isDoctorAvailable(doctorid, requesteddate, requestedtime);
        if (!available) {
            return res.status(400).json({ message: "Doctor not available at this time." });
        }

        // Create the appointment
        const appointment = await Appointments.create({ 
            doctorid,  
            requesteddate, 
            requestedtime, 
            patientid 
        });

        console.log('Appointment created:', appointment);
        res.status(201).json({ message: "Appointment created successfully", appointment });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


const createAppointmentReceptionist = async (req, res) => {
    try {
        const { doctorid, requesteddate, requestedtime , patientid} = req.body;

        console.log('Searching for receptionist with email:', req.user.email); 
        const receptionist = await Receptionists.findOne({ where: { email: req.user.email } });
        if (!receptionist) {
            return res.status(400).json({ message: "receptionist not authenticated or not found." });
        }

        const receptionistid = receptionist.dataValues.receptionistid;  
    
        //log received data 
        console.log('Received data for appointment creation:', { doctorid, requesteddate, requestedtime, patientid , receptionistid});

        // Check if all required fields are provid
        if (!doctorid || !requesteddate || !requestedtime || !patientid || !receptionistid) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Check doctor availability
        const available = await isDoctorAvailable(doctorid, requesteddate, requestedtime);
        if (!available) {
            return res.status(400).json({ message: "Doctor not available at this time." });
        }

        // Create the appointment
        const appointment = await Appointments.create({ 
            doctorid,  
            requesteddate, 
            requestedtime, 
            patientid,
            receptionistid
        });

        console.log('Appointment created:', appointment);
        res.status(201).json({ message: "Appointment created successfully", appointment });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

//Update appoinments as receptionist
const updateAppointmentReceptionist = async (req, res) => {
    try {
        const { appointmentid } = req.params;
        const { doctorid, requesteddate, requestedtime, patientid } = req.body;

        console.log('Receptionist updating appointment:', { appointmentid, doctorid, requesteddate, requestedtime, patientid });

        // Validate required fields
        if (!doctorid || !requesteddate || !requestedtime || !patientid) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Check if appointment exists
        const appointment = await Appointments.findByPk(appointmentid);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        // Check if patient exists
        const patient = await Patients.findByPk(patientid);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found." });
        }

        // Check doctor availability
        const available = await isDoctorAvailable(doctorid, requesteddate, requestedtime, appointmentid);
        if (!available) {
            return res.status(400).json({ message: "Doctor not available at this time." });
        }

        // Perform update
        await appointment.update({
            doctorid,
            requesteddate,
            requestedtime,
            patientid
        });

        console.log('Appointment updated by receptionist:', appointment);
        res.status(200).json({ message: "Appointment updated successfully", appointment });
    } catch (error) {
        console.error('Error updating appointment as receptionist:', error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


// Update appointment as patient
const updateAppointment = async (req, res) => {
    try {
        const { appointmentid } = req.params;
        const { doctorid, requesteddate, requestedtime } = req.body;
        const patient = await Patients.findOne({ where: { email: req.user.email } });

        if (!patient) {
            return res.status(400).json({ message: "patient not authenticated or not found." });
        }
        const patientid = patient.dataValues.patientid; 

        console.log('Received data for appointment update:', { appointmentid, doctorid, requesteddate, requestedtime });

        // Check if all required fields are provided
        if (!doctorid || !requesteddate || !requestedtime) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        //find the existing appointment
        const appointment = await Appointments.findByPk(appointmentid);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found." });
        }
        console.log("Found existing appointment:", appointment); 

        const available = await isDoctorAvailable(doctorid, requesteddate, requestedtime, appointmentid);
        if (!available) {
            return res.status(400).json({ message: "Doctor not available at this time." });
        }
 
        //update
        await appointment.update({ doctorid, requesteddate, requestedtime });

        console.log('Appointment updated:', appointment);
        res.status(200).json({ message: "Appointment updated successfully", appointment });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ message: "Internal Server Error", error });
    } 
};

module.exports = {getAllAppointments, getPatientAppointments, isDoctorAvailable, createAppointmentReceptionist, createAppointment,  updateAppointment, updateAppointmentReceptionist }; 