const { Op, where } = require("sequelize");
const {Doctors,Users, Appointments, Patients} = require('../models');



const getIfDoctorInfo = async (req, res) => {
    const email = req.user.email;

    try {
        const docExists = await Doctors.findOne({
            where: { email },
            attributes: ['firstname', 'lastname', 'dateofbirth', 'phonenumber']
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
        const { firstname, lastname, dateofbirth, phonenumber} = req.body;
        const email = req.user.email;  

        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Email not found." });
        }
        const doctorid = user.userid;   

        console.log('Received data for doctor profile creation:', { doctorid, email, firstname, lastname, dateofbirth, phonenumber });

        if (!firstname || !lastname || !dateofbirth || !phonenumber ) {
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
        });

        const user = await Users.findOne({
            where: { email: email },
        });

        if (user) {
            await user.update({
                firstname: firstname,
                lastname: lastname,
                dateofbirth: dateofbirth,
                phonenumber: phonenumber,
            });
        }

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
            attributes: ['doctorid','firstname', 'lastname']
        });
        console.log("Doctors fetched:", doctors);

        const doctorNames = doctors.map(doctor => {
            return {
                doctorid: doctor.doctorid, 
                name: `${doctor.firstname} ${doctor.lastname}`,
                firstname: doctor.firstname,
                lastname: doctor.lastname,
                type: doctor.doctortype  
            };
        });

        res.json(doctorNames);  
    } catch (error) {
        console.error("Error fetching doctors' names:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

const getAppointmentByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

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

        //condition that for only providing params if  start date and end date provided
        let whereCondition = { doctorid };
        if (startDate && endDate) {
            if (startDate > endDate) {
                return res.status(400).json({ message: "Start date must be before end date." });
            }
            whereCondition.requesteddate = {
                [Op.between]: [startDate, endDate],
            };
        }

        //fetch appointments based on the date range!
        const appointments = await Appointments.findAll({
            where: whereCondition,
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
            appointmentid: appt.appointmentid,
            appointmentid: appt.appointmentid,
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


module.exports = {inputInfoForFirstTime, getIfDoctorInfo, editDoctorInfo, getDoctorsNames, getAppointmentByDateRange}; 