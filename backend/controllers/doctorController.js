const { Op, where } = require("sequelize");
const {Doctors,Users, Appointments, Specialists, Patients} = require('../models');



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

//To update the receptionist table after accepting the application
const syncDoctors = async (req, res) => {
    try {
      // Get all users who are receptionists
      const doctorUsers = await Users.findAll({
        where: { role: 'doctor' , status: 'accepted'}
      });
  
      for (const user of doctorUsers) {
        // Ensure user data is available and valid
        const { firstname, lastname, dateofbirth, phonenumber, email, userid } = user;
  
        // Log and check the retrieved data
        console.log('User data:', { firstname, lastname, dateofbirth, phonenumber, email });
  
        if (!firstname || !lastname || !dateofbirth || !phonenumber) {
          console.log(`Skipping user due to missing fields: ${email}`);
          continue;  // Skip this user if any field is missing
        }
  
        // Check if already added to avoid duplicates
        const exists = await Doctors.findOne({
          where: { email }
        });
  
        if (!exists) {
          await Doctors.create({
            doctorid: userid,
            firstname,
            lastname,
            dateofbirth,
            phonenumber,
            doctortype: "Primary Care",
            email
          });
          console.log(`Added doctor: ${firstname} ${lastname}`);
        } else {
          console.log(`Doctor ${email} already exists.`);
        }
      }
        
      console.log('Doctor sync complete.');
      res.status(200).json({ message: 'Doctor sync complete.' });
    } catch (error) {
      console.error('Error syncing doctors:', error);
      res.status(500).json({ message: 'Error syncing doctors', error: error.message });
    }
  };


    //To update the receptionist table after accepting the application
    const syncSpecialists = async (req, res) => {
        try {
        // Get all users who are receptionists
        const specialistUsers = await Users.findAll({
            where: { role: 'specialist' , status: 'accepted'}
        });
    
        for (const user of specialistUsers) {
            // Ensure user data is available and valid
            const { firstname, lastname, dateofbirth, phonenumber, email, userid } = user;
    
            // Log and check the retrieved data
            console.log('User data:', { firstname, lastname, dateofbirth, phonenumber, email, userid });
    
            if (!firstname || !lastname || !dateofbirth || !phonenumber) {
            console.log(`Skipping user due to missing fields: ${email}`);
            continue;  // Skip this user if any field is missing
            }
    
            // Check if already added to avoid duplicates
            const exists = await Specialists.findOne({
            where: { email }
            });
    
            if (!exists) {
            await Specialists.create({
                user_id: userid,
                firstname: firstname,
                lastname: lastname,
                dateofbirth: dateofbirth,
                phonenumber:phonenumber,
                specialty: "None",
                email: email
            });
            console.log(`Added specialist: ${firstname} ${lastname}`);
            } else {
            console.log(`specialist ${email} already exists.`);
            }
        }
    
        console.log('specialist sync complete.');
        res.status(200).json({ message: 'specialist sync complete.' });
        } catch (error) {
        console.error('Error syncing specialist:', error);
        res.status(500).json({ message: 'Error syncing specialist', error: error.message });
        }
    };
      


module.exports = {inputInfoForFirstTime, syncSpecialists, getIfDoctorInfo, editDoctorInfo, getDoctorsNames, getAppointmentByDateRange, syncDoctors}; 