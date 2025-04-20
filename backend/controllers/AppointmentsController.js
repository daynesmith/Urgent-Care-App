const { Appointments , Patients, Receptionists, Specialists, Shifts, Doctors, Referral } = require('../models'); 
const { Op } = require("sequelize");

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
      const appointments = await Appointments.findAll({
        include: [
            {
              model: Patients,
              as: 'patient',
              attributes: ['firstname', 'lastname', 'phonenumber', 'email']
            },
            {
              model: Doctors,
              as: 'doctor',
              attributes: ['firstname', 'lastname']
            }
          ]
      });
  
      res.status(200).json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

const getSingleAppointment = async (req, res) => {
    const apptPageId = parseInt(req.params.appointmentid)

    try {
        const appointment = await Appointments.findOne({
            where: { appointmentid: apptPageId }
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json(appointment);
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }


}

/// helper function
const convertTo24HourFormat = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
        hours = '00';
    }

    if (modifier === 'PM') {
        hours = String(parseInt(hours, 10) + 12);
    }

    return `${hours}:${minutes}:00`;
};

const isDoctorAvailable = async (doctorid, requesteddate, requestedtime, appointmentid, cliniclocation) => {
    const conflictCondition = {
        doctorid,
        requesteddate,
        requestedtime,
        cliniclocation,
    };

    if (appointmentid) {
        conflictCondition.appointmentid = { [Op.ne]: appointmentid };
    }

    const formattedTime = convertTo24HourFormat(requestedtime);

    const doctorShift = await Shifts.findOne({
        where: {
            staffid: doctorid,
            date: requesteddate,
            startshift: { [Op.lte]: formattedTime }, 
            endshift: { [Op.gte]: formattedTime },   
            cliniclocation: cliniclocation,
        },
    });

    if (!doctorShift) {
        console.log("Doctor does not have shift during the requested time or location.");
        return false;
    }

    const conflictingAppointment = await Appointments.findOne({
        where: conflictCondition,
    });

    return conflictingAppointment ? false : true;
};

//INCLUDE THIS 
const isSpecialistAvailable = async (specialistid, requesteddate, requestedtime, appointmentid, cliniclocation) => {
    const conflictCondition = {
        specialistid,
        requesteddate,
        requestedtime,
        cliniclocation
    };

    if (appointmentid) {
        conflictCondition.appointmentid = { [Op.lte]: appointmentid };
    }

    const formattedTime = convertTo24HourFormat(requestedtime);

    const specialistShift = await Shifts.findOne({
        where: {
            staffid: specialistid,
            date: requesteddate,
            startshift: { [Op.lte]: formattedTime }, 
            endshift: { [Op.gte]: formattedTime },   
            cliniclocation: cliniclocation,
        },
    });

    if (!specialistShift) {
        console.log("Specialist does not have shift during the requested time or location.");
        return false;
    }

    const conflictingAppointment = await Appointments.findOne({
        where: conflictCondition,
    });

    return conflictingAppointment ? false : true;
};



const createAppointment = async (req, res) => {
    try {
        const { doctorid, requesteddate, requestedtime, cliniclocation} = req.body;
        const patient = await Patients.findOne({ where: { email: req.user.email } });

        if (!patient) {
            return res.status(400).json("Please fill out paitent info form patient not authenticated or not found." );
        }
        const patientid = patient.dataValues.patientid;  
 
        console.log('Received data for appointment creation:', { doctorid, requesteddate, requestedtime, patientid, cliniclocation });

        if ( !doctorid|| !requesteddate || !requestedtime || !patientid || !cliniclocation) {
            return res.status(400).json("Missing required fields." );
        }

        const formattedTime = convertTo24HourFormat(requestedtime);

        const existingAppointment = await Appointments.findOne({
            where: {
                patientid,
                requesteddate,
                requestedtime: formattedTime,
            },
        });
        if (existingAppointment) {
            return res.status(400).json("Patient already has an appointment scheduled at this time.");
        }

        const available = await isDoctorAvailable(doctorid, requesteddate, requestedtime, { appointmentid: null }, cliniclocation);
        if (!available) {
            return res.status(400).json("Doctor not available at this time or location." );
        }

        const appointment = await Appointments.create({ 
            doctorid,  
            requesteddate, 
            requestedtime: formattedTime, 
            patientid,
            cliniclocation,
        });

        console.log('Appointment created:', appointment);
        res.status(201).json("Appointment created successfully");
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json("Internal Server Error");
    }
};

const createAppointmentSpecialist = async (req, res) => {
    try {
        const { specialistid, requesteddate, requestedtime, cliniclocation } = req.body;

        const patient = await Patients.findOne({ where: { email: req.user.email } });

        if (!patient) {
            return res.status(400).json("Patient not authenticated or not found. Please fill out the patient info form.");
        }

        const patientid = patient.dataValues.patientid;

        if (!specialistid || !requesteddate || !requestedtime || !cliniclocation) {
            return res.status(400).json("Missing required fields.");
        }

        const formattedTime = convertTo24HourFormat(requestedtime);

        const existingAppointment = await Appointments.findOne({
            where: {
                patientid,
                requesteddate,
                requestedtime: formattedTime,
            },
        });

        if (existingAppointment) {
            return res.status(400).json("Patient already has an appointment scheduled at this time.");
        }

        const available = await isSpecialistAvailable(specialistid, requesteddate, requestedtime, { appointmentid: null }, cliniclocation);

        if (!available) {
            return res.status(400).json("Specialist not available at this time or location.");
        }

        const referral = await Referral.findOne({
            where: {
                patient_id: patientid,
                specialist_id: specialistid,
                status: "approved"
            }
        });

        if (!referral) {
            return res.status(400).json("Referral not yet approved or no referral has been made for this patient and specialist.");
        }

        const appointment = await Appointments.create({
            specialistid: specialistid,
            requesteddate,
            requestedtime: formattedTime,
            patientid,
            cliniclocation,
            doctorid: referral.doctor_id
        });

        console.log('Appointment created:', appointment);
        res.status(201).json("Appointment created successfully");
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json("Internal Server Error");
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
    
        console.log('Received data for appointment creation:', { doctorid, requesteddate, requestedtime, patientid , receptionistid});

        if (!doctorid || !requesteddate || !requestedtime || !patientid || !receptionistid) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const existingAppointment = await Appointments.findOne({
            where: {
                patientid,
                requesteddate,
                requestedtime,
            },
        });
        if (existingAppointment) {
            return res.status(400).json({
                message: "Patient already has an appointment scheduled at this time.",
            });
        }

        const available = await isDoctorAvailable(doctorid, requesteddate, requestedtime);
        if (!available) {
            return res.status(400).json({ message: "Doctor not available at this time." });
        }

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

const updateAppointmentReceptionist = async (req, res) => {
    try {
        const { appointmentid } = req.params;
        const { doctorid, requesteddate, requestedtime, patientid } = req.body;

        console.log('Receptionist updating appointment:', { appointmentid, doctorid, requesteddate, requestedtime, patientid });

        if (!doctorid || !requesteddate || !requestedtime || !patientid) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const appointment = await Appointments.findByPk(appointmentid);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        const patient = await Patients.findByPk(patientid);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found." });
        }

        const available = await isDoctorAvailable(doctorid, requesteddate, requestedtime, appointmentid);
        if (!available) {
            return res.status(400).json({ message: "Doctor not available at this time." });
        }

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

//not used, reschedule appointment is being used
const updateAppointment = async (req, res) => {
    try {
        const { appointmentid } = req.params;
        const { doctorid, requesteddate, requestedtime, cliniclocation } = req.body;
        const patient = await Patients.findOne({ where: { email: req.user.email } });

        if (!patient) {
            return res.status(400).json({ message: "patient not authenticated or not found." });
        }
        const patientid = patient.dataValues.patientid; 

        console.log('Received data for appointment update:', { appointmentid, doctorid, requesteddate, requestedtime, cliniclocation });

        if (!doctorid || !requesteddate || !requestedtime || !cliniclocation) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const appointment = await Appointments.findByPk(appointmentid);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found." });
        }
        console.log("Found existing appointment:", appointment); 

        const available = await isDoctorAvailable(doctorid, requesteddate, requestedtime, { appointmentid: null }, cliniclocation);
        if (!available) {
            return res.status(400).json("Doctor not available at this time or location.");
        }
 
        await appointment.update({ doctorid, requesteddate, requestedtime, cliniclocation });

        console.log('Appointment updated:', appointment);
        res.status(200).json({ message: "Appointment updated successfully", appointment });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ message: "Internal Server Error", error });
    } 
};

const updateStatus = async (req, res) => {
    try {
      const { appointmentid, appointmentstatus } = req.body;
  
      console.log("Update Request:", { appointmentid, appointmentstatus });
  
      const appointment = await Appointments.findByPk(appointmentid);
  
      if (!appointment) {
        console.log("Appointment not found");
        return res.status(404).json({ error: "Appointment not found" });
      }
  
      await appointment.update({ appointmentstatus });
  
      console.log("Updated appointment:", appointment);
  
      return res.status(200).json({ message: "Appointment status updated successfully" });
    } catch (error) {
      console.error("Error updating appointment status:", error);
      return res.status(500).json({ error: "Failed to update appointment status" });
    }
  };
  
  

const cancelAppointment = async (req,res) => {
    const apptPageId = parseInt(req.params.appointmentid)

    try {
        const appointment = await Appointments.findOne({
            where: { appointmentid: apptPageId }
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        await appointment.update({
            appointmentstatus: "cancelled"
        });

        console.log("Database update successful:");
        res.json({ success: true });

    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

// only doing requested visits so far and not "upcoming visits"
const rescheduleAppointment = async (req, res) => {


    const apptPageId = parseInt(req.params.appointmentid);
    const { requesteddate, requestedtime, cliniclocation } = req.body;

    console.log("Reschedule request received:", { requesteddate, requestedtime, cliniclocation });

    try {
        const appointment = await Appointments.findOne({
            where: { appointmentid: apptPageId }
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        const formattedTime = convertTo24HourFormat(requestedtime);

        const doctorid = appointment.doctorid;

        const available = await isDoctorAvailable(doctorid, requesteddate, requestedtime, { appointmentid: apptPageId }, cliniclocation);
        if (!available) {
            return res.status(400).json("Doctor not available at this time or location." );
        }

        await appointment.update({
            requesteddate,
            requestedtime: formattedTime,
            cliniclocation,
        });

        res.json({ success: true, message: "Appointment rescheduled successfully" });

    } catch (error) {
        console.error("Error rescheduling appointment:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {getAllAppointments, getPatientAppointments, isDoctorAvailable, createAppointmentReceptionist, createAppointment,  updateAppointment, updateAppointmentReceptionist, updateStatus , getSingleAppointment, cancelAppointment, rescheduleAppointment, createAppointmentSpecialist};
