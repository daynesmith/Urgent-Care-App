const { Op } = require("sequelize");
const {Doctors,Users, Appointments, Patients} = require('../models');



const getIfDoctorInfo = async (req, res) => {
    const email = req.user.email;

    try {
        const docExists = await Doctors.findOne({
            where: { email },
            attributes: ['firstname', 'lastname', 'dateofbirth', 'phonenumber', 'doctortype']
        });

        if (!docExists) {
            return res.status(200).json({ formFilled: false });
        }

      
        return res.status(200).json({
            formFilled: true,
            doctorInfo: docExists 
        });

    } catch (error) {
        console.error("Error checking doctor info:", error);
        res.status(500).json({ error: "Error finding doctor info" });
    }
};


const inputInfoForFirstTime = async (req, res) => {
    try {
        const { firstname, lastname, dateofbirth, phonenumber, doctortype } = req.body;
        const email = req.user.email;  

        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Email not found." });
        }
        const doctorid = user.userid;   

        console.log('Received data for doctor profile creation:', { doctorid, email, firstname, lastname, dateofbirth, phonenumber, doctortype });

        if (!firstname || !lastname || !dateofbirth || !phonenumber || !doctortype) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // create the doctor profile 
        const doctor = await Doctors.create({
            doctorid,
            email,
            firstname,
            lastname,
            dateofbirth,
            phonenumber,
            doctortype
        });

        console.log('Doctor profile created:', doctor);
        res.status(201).json({ message: "Doctor profile created successfully", doctor });

    } catch (error) {
        console.error("Error creating doctor profile:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


const editDoctorInfo = async (req, res) => {

    const { email } = req.user;
    const {
        firstname,
        lastname,
        dateofbirth,
        phonenumber,
        doctortype
    } = req.body

    try {
        const doctor = await Doctors.findOne({
            where:{email: email},
        })

        if (!doctor) {
            return res.status(400).json({ message: "doctor not found with token." });
        }

        await doctor.update({
            firstname: firstname,
            lastname: lastname,
            dateofbirth: dateofbirth,
            phonenumber: phonenumber,
            doctortype: doctortype
        });

        console.log("Database update successful:");
        res.json({ success: true });

    } catch (error) {
        console.error("Error updating doctor info:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};





const getDoctorsNames = async (req, res) => {
    try {
        const doctors = await Doctors.findAll({
            attributes: ['doctorid','firstname', 'lastname', 'doctortype']
        });

        const doctorNames = doctors.map(doctor => {
            return {
                doctorid: doctor.doctorid, 
                name: `${doctor.firstname} ${doctor.lastname}`,
                type: doctor.doctortype  
            };
        });

        res.json(doctorNames);  
    } catch (error) {
        console.error("Error fetching doctors' names:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

//using doctorid and requestedtime, requesteddate to query
/*
const getDoctorAppointments = async (req, res) => {
    try {
        const { requesteddate, requestedtime } = req.query;
        if (!requesteddate || !requestedtime) {
            return res.status(400).json({ message: "Please provide both requesteddate and requestedtime." });
        }

        const email = req.user.email;
        const user = await Users.findOne({
            where: { email }
        });
        if (!user) {
            return res.status(404).json({ message: "Email not found." });
        }

        const doctorid = user.userid;

        //fetch doctor's appointments
        const appointments = await Appointments.findAll({
            where: {
                doctorid,
                requesteddate: {   //from 0-11:59
                    [Sequelize.Op.gte]: new Date(requesteddate).setHours(0, 0, 0, 0), 
                    [Sequelize.Op.lt]: new Date(requesteddate).setHours(23, 59, 59, 999), 
                },
                requestedtime,
            }
        });

        if (!appointments.length) {
            return res.status(404).json({ message: "No appointments found for this doctor on the specified date and time." });
        }

        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching doctor appointments:', error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
*/


const getAppointmentByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate ) {
            return res.status(400).json({ message: "Start date and end date are required." });
        }

        const email = req.user.email;
        const user = await Users.findOne({
            where: { email }
        });
        if (!user) {
            return res.status(404).json({ message: "Email not found." });
        }

        const doctorid = user.userid;
        console.log("Doctor ID:", doctorid);
        if (!doctorid) {
            return res.status(400).json({ message: "Doctor ID not found." });
        }


        if (startDate > endDate) {
            return res.status(400).json({ message: "Start date must be before end date." });
        }

        //fetch appointments based on the date range
        const appointments = await Appointments.findAll({
            where: {
                doctorid: doctorid,
                requesteddate: {
                    [Op.between]: [startDate, endDate],  
                }
            },
            include: [
                {
                    model: Patients,
                    as: 'patient',
                    attributes: ['firstname', 'lastname'],
                }
            ],
            order: [['requesteddate', 'ASC'], ['requestedtime', 'ASC'], ['appointmentid', 'ASC']]
        });

        function capitalizeName(name) {
            return name.split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' ');
        }

        const formattedAppointments = appointments.map(appt => ({
            patientname: capitalizeName(`${appt.patient.firstname} ${appt.patient.lastname}`),
            requesteddate: appt.requesteddate,
            requestedtime: appt.requestedtime,
            appointmentstatus: appt.appointmentstatus,
            recommendedspecialist: appt.recommendedspecialist,
        }));


        console.log("Appointments found:", formattedAppointments.length);
        console.log("Raw appointment data with patient include:\n", JSON.stringify(formattedAppointments, null, 2));

        return res.status(200).json({appointments: formattedAppointments});

    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Internal server error.", error });
    }
};


/*
const getPatientInfo = async (req, res) => {
    try {
        const { patientId } = req.params;  

        // Find the patient by patientid
        const patient = await Patients.findOne({
            where: { patientid: patientId },
            include: ['appointments'], // Optionally, you can include their appointments if needed
        });

        // Check if the patient was found
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found.' });
        }

        // Return patient data
        return res.status(200).json(patient);
    } catch (error) {
        console.error('Error fetching patient info:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
*/



module.exports = {inputInfoForFirstTime, getIfDoctorInfo, editDoctorInfo, getDoctorsNames, getAppointmentByDateRange}; 