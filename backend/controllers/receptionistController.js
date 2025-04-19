const { Receptionists, Users, Shifts, Patients} = require('../models'); // Import the Receptionist model

const getIfReceptionistInfo = async (req, res) => {
    const email = req.user.email; // Get the email of the currently authenticated user.

    try {
        // Attempt to find the receptionist's information by email.
        const receptionist = await Receptionists.findOne({ where: { email: email } });

        // If no receptionist record is found, return a response indicating no info.
        if (!receptionist) {
            return res.status(200).json({
                formFilled: false,
                message: "Receptionist information not found."
            });
        }

        // If receptionist data is found, return the information along with formFilled: true.
        return res.status(200).json({
            formFilled: true,
            receptionist: {
                firstname: receptionist.firstname,
                lastname: receptionist.lastname,
                phonenumber: receptionist.phonenumber,
                dateofbirth: receptionist.dateofbirth,
                email: receptionist.email
            }
        });
    } catch (error) {
        // Catch any errors during the process and log them.
        console.error(error);
        return res.status(500).json({
            message: "Error retrieving receptionist information.",
            error: error.message
        });
    }
};

const updateProfile = async (req, res) => {
    try {
      const email = req.user.email; // Authenticated user's email
      const { firstname, lastname, phonenumber } = req.body;
  
      // Validate input
      if (!firstname || !lastname || !phonenumber) {
        return res.status(400).json({ message: "Missing required fields." });
      }
  
      // Find the receptionist by email
      const receptionist = await Receptionists.findOne({ where: { email } });
      if (!receptionist) {
        return res.status(404).json({ message: "Receptionist profile not found." });
      }
  
      // Update the receptionist fields
      receptionist.firstname = firstname;
      receptionist.lastname = lastname;
      receptionist.phonenumber = phonenumber;
      await receptionist.save();
  
      // Also update the associated User record
      const user = await Users.findOne({ where: { email } });
      if (user) {
        user.firstname = firstname;
        user.lastname = lastname;
        user.phonenumber = phonenumber;
        await user.save();
      }
  
      console.log(`Updated profile for ${email} in both Receptionists and Users tables.`);
      return res.status(200).json({
        message: "Profile updated successfully",
        receptionist,
        userUpdated: !!user, // optional: indicate if user table was also updated
      });
  
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  };
  

const inputReceptionistInfoForFirstTime = async (req, res) => {
    try {
        const { firstname, lastname, dateofbirth, phonenumber} = req.body;
        const email = req.user.email;  

        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Email not found." });
        }
        const receptionistid = user.userid;   

        console.log('Received data for receptionist profile creation:', { receptionistid, email, firstname, lastname, dateofbirth, phonenumber });

        if (!firstname || !lastname || !dateofbirth || !phonenumber) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const receptionist = await Receptionists.create({
            receptionistid, 
            email,
            firstname,
            lastname,
            dateofbirth,
            phonenumber
        });

        console.log('Receptionist profile created:', receptionist); 
        res.status(201).json({ message: "Receptionist profile created successfully", receptionist });

    } catch (error) {
        console.error("Error creating Receptionist profile:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


//To update the receptionist table after accepting the application
const syncReceptionists = async (req, res) => {
    try {
      // Get all users who are receptionists
      const receptionistUsers = await Users.findAll({
        where: { role: 'receptionist' , status: 'accepted'}
      });
  
      for (const user of receptionistUsers) {
        // Ensure user data is available and valid
        const { firstname, lastname, dateofbirth, phonenumber, email, userid } = user;
  
        // Log and check the retrieved data
        console.log('User data:', { firstname, lastname, dateofbirth, phonenumber, email });
  
        if (!firstname || !lastname || !dateofbirth || !phonenumber) {
          console.log(`Skipping user due to missing fields: ${email}`);
          continue;  // Skip this user if any field is missing
        }
  
        // Check if already added to avoid duplicates
        const exists = await Receptionists.findOne({
          where: { email }
        });
  
        if (!exists) {
          await Receptionists.create({
            receptionistid: userid,
            firstname,
            lastname,
            dateofbirth,
            phonenumber,
            email
          });
          console.log(`Added receptionist: ${firstname} ${lastname}`);
        } else {
          console.log(`Receptionist ${email} already exists.`);
        }
      }
  
      console.log('Receptionist sync complete.');
      res.status(200).json({ message: 'Receptionist sync complete.' });
    } catch (error) {
      console.error('Error syncing receptionists:', error);
      res.status(500).json({ message: 'Error syncing receptionists', error: error.message });
    }
  };
  
const addNewShift = async (req, res) => {
    try {
        const { staffid, startshift, endshift, date, notes, cliniclocation} = req.body;
        
        console.log('Received data for new shift creation:', { staffid, startshift, endshift, date, notes, cliniclocation });

        const existingShift = await Shifts.findOne({
            where: {
                staffid,
                date,
            },
        });
        if (existingShift) {
            return res.status(400).json({ message: "A shift already exists for this staff member on the selected date." });
        }

        if (!staffid || !startshift || !endshift || !date || !cliniclocation) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const shift = await Shifts.create({
            staffid,
            startshift,
            endshift,
            date,
            notes,
            cliniclocation
        });

        console.log('Shift created:', shift);
        res.status(201).json({ message: "Shift created successfully", shift });
    } catch (error) {
        console.error("Error creating shift:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

const getAllShifts = async (req, res) => {
    try {
        const shifts = await Shifts.findAll({
            include: [
                {
                    model: Users,
                    as: 'staff',
                    attributes: ['firstname', 'lastname', 'role'],
                },
            ],
        });
        res.status(200).json(shifts);
    } catch (error) {
        console.error("Error fetching shifts:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

const getPatientsNames = async (req, res) => {
  try {
      // Fetch all patients with their patientid, firstname, and lastname
      const patients = await Patients.findAll({
          attributes: ['patientid', 'firstname', 'lastname']
      });

      // Format the patient data
      const formatted = patients.map((p) => ({
          patientid: p.patientid,
          name: `${p.firstname} ${p.lastname}`
      }));

      // Send the formatted response
      res.json(formatted);
  } catch (error) {
      console.error("Error fetching patient names:", error);
      res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { getIfReceptionistInfo, getPatientsNames, inputReceptionistInfoForFirstTime, syncReceptionists, updateProfile, addNewShift, getAllShifts};

