const bcrypt = require('bcrypt');
const { Users , Patients, Doctors, Applications, Nurses, Receptionists, Shifts, Specialists} = require('../models'); // Adjust the path according to your project structure
const {sign} = require('jsonwebtoken')


const registerUser = async (req, res) => {
    const { email, password, firstname, lastname, dateofbirth, phonenumber, street, city, state, zip, } = req.body;

    try {
        const hash = await bcrypt.hash(password, 10);
        await Users.create({
            email: email,
            passwordhash: hash,
            firstname,
            lastname,
            dateofbirth,
            phonenumber,
            street,
            city,
            state,
            zip,
        });
        res.status(200).json("success");
    } catch (error) {
        if (error.original && error.original.code === 'ER_DUP_ENTRY') {
            return res.status(400).json('Email already registered');
          }

        console.error(error);
        res.status(500).json("Error registering user");
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json("User not found");
        }
        const isMatch = await bcrypt.compare(password, user.passwordhash);

        if (!isMatch) {
            return res.status(400).json("Invalid credentials");
        }
        
        const accessToken = sign({ email: user.email, role: user.role, id: user.id }, process.env.jwtsecret, { //session token created stores role id and email
            expiresIn: '1h'
        });
        
        //return user role to be used for redirection and for context
        const userRole = user.role;

        res.status(200).json({
            message: "Login successful" ,
            accessToken, 
            userRole: user.role,
            userId: user.userid,
            userStatus: user.status
        });
    } catch (error) {
        console.error(error);
        res.status(500).json("Error logging in user");
    }
};



const sendingApplications = async (req, res) => {
    const {
        firstname,
        lastname,
        dateofbirth,
        phonenumber,
        qualifications,
        certifications,
        stafftype,
        email,
        password,
        experience,
        coverletter,
        street,
        city,
        state,
        zip,
      } = req.body;
    try {
      console.log('Received data for application creation:', {
        firstname,
        lastname,
        dateofbirth,
        phonenumber,
        stafftype,
        email,
        password,
        experience,
        coverletter,
        street,
        city,
        state,
        zip,
      });
  
      // Validate required fields
      if (
        !firstname || !lastname || !dateofbirth || !phonenumber || !stafftype ||
        !email || !password || !experience  || !street || !city || !state || !zip
      ) {
        return res.status(400).json({ error: 'All fields are required.' });
      }
  
      const passwordhash = await bcrypt.hash(password, 10);
  
      const applicationData = await Users.create({
        firstname,
        lastname,
        dateofbirth,
        phonenumber,
        role: stafftype,
        email,
        passwordhash,
        experience,
        qualifications,
        certifications,
        coverletter,
        street,
        city,
        state,
        zip,
      });
  
      console.log('Application is created:', applicationData);
      res.status(201).json({ message: 'Application was created successfully', applicationData });
  
    } catch (error) {
      console.error('Error processing application:', error);
      res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
  };
  



  const gettingApplications = async (req, res) => {
    console.log('Request received at backend over here.');
    try {
        const applications = await Users.findAll({
            attributes: [
              'firstname',
              'lastname',
              'dateofbirth',
              'phonenumber',
              ['role', 'stafftype'],  // Using alias here to match the frontend expectation
              'email',
              'passwordhash',
              'qualifications',
              'certifications',
              'coverletter',
              'experience',
              'street',
              'city',
              'state',
              'zip',
              'status',
            ],
            where: {
                role: ['doctor', 'receptionist', 'admin', 'specialist', 'nurse']
            }
        });
        res.json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const creatingUser= async (req, res) => {
    const { email, password, role} = req.body;

    try {
        const hash = await bcrypt.hash(password, 10);
        await Users.create({
            email: email,
            passwordhash: hash,
            role: role
        });
        res.status(200).json("success");
    } catch (error) {
        if (error.original && error.original.code === 'ER_DUP_ENTRY') {
            return res.status(400).json('Email already registered');
          }

        console.error(error);
        res.status(500).json("Error registering user");
    }
};


const updateApplicationStatus = async (req, res) => {
    const { status, email } = req.body;
  
    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }
  
    try {
      const app = await Users.findOne({ where: { email } });
  
      if (!app) {
        return res.status(404).json({ error: "Application not found." });
      }
  
      app.status = status;
      await app.save();
  
      res.json({
        message: `Application status updated to ${status}.`,
        application: app,
      });
    } catch (error) {
      console.error("Error updating application status:", error);
      res.status(500).json({ error: "Internal server error." });
    }
};
  

const getStaffUsers = async (req, res) => {
    try {
        const staffUsers = await Users.findAll({
            where: {
                role: ['doctor', 'receptionist', 'specialist','nurse']
            }
        });
        const userNames = staffUsers.map(user => {
          return {
              staffid: user.userid, 
              name: `${user.firstname} ${user.lastname}`,
              role: user.role
          };
      });
        res.json(userNames);
    } catch (error) {
        console.error("Error fetching staff users:", error);
        res.status(500).json({ message: "Server error" });
    }
}
const getEmployeeUsers = async (req, res) => {
    try {
        const staffUsers = await Users.findAll({
            where: {
                role: ['doctor', 'receptionist', 'specialist', 'nurse']
            },
        });
        console.log("Staff users:", staffUsers); 
        // Map through the staffUsers to build the response
        const userNames = staffUsers.map(user => {

            return {
                staffid: user.userid,
                name: `${user.firstname} ${user.lastname}`,
                role: user.role,
                phonenumber: user.phonenumber,
                email: user.email,
            };
        });

        res.json(userNames);
    } catch (error) {
        console.error("Error fetching staff users:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getStaffShifts = async (req, res) => {
    try {
        console.log("Decoded Token (req.user):", req.user);

        const email = req.user.email; // Use email from the token
        const user = await Users.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const staffid = user.userid;

        const staffShifts = await Shifts.findAll({
            where: {
                staffid: staffid,
            },
            include: [
                {
                    model: Users,
                    as: 'staff',
                    attributes: ['firstname', 'lastname', 'role'],
                },
            ],
        });
        res.status(200).json(staffShifts);
    } catch (error) {
        console.error("Error fetching staff shifts:", error);
        res.status(500).json({ message: "Server error" });
    }
}
const getSpeciality = async (req, res) => {
    try {
        const userId = req.params.userid || req.user?.id; // Use req.params.userid if coming from a frontend request

        if (!userId) {
            return res.status(400).json({ message: "User ID is missing." });
        }

        const specialist = await Specialists.findOne({
            where: { user_id: userId },
            attributes: ['specialty'],
        });

        if (!specialist) {
            return res.status(404).json({ message: "Specialty not found." });
        }

        res.status(200).json(specialist);
    } catch (error) {
        console.error("Error fetching specialist type", error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateEmployeeUsers = async (req, res) => {
  try {
    const { staffid, name, email, phonenumber, role, specialty } = req.body;

    if (!staffid) {
      console.warn("❗ Missing staff ID in request");
      return res.status(400).json({ message: "Staff ID is required" });
    }

    console.log("📦 Incoming employee update payload:", {
      staffid,
      name,
      email,
      phonenumber,
      role,
      specialty,
    });

    const [firstname, ...lastNameParts] = name.trim().split(" ");
    const lastname = lastNameParts.join(" ") || "";

    console.log(`🧩 Parsed name -> Firstname: ${firstname}, Lastname: ${lastname}`);

    const user = await Users.findOne({ where: { userid: staffid } });

    if (!user) {
      console.warn(`⚠️ User not found with userid: ${staffid}`);
      return res.status(404).json({ message: "Employee not found" });
    }

    console.log("🛠️ Updating Users table...");
    await user.update({ firstname, lastname, email, phonenumber, role });
    console.log("✅ Users table updated successfully");

    // Role-specific updates only if the entry exists
    if (role === "specialist") {
      const specialist = await Specialists.findOne({ where: { user_id: staffid } });
      if (specialist) {
        await specialist.update({ firstname, lastname, email, phonenumber, specialty });
        console.log("✅ Specialist table updated");
      } else {
        console.log("❕ No existing Specialist record found — skipping update");
      }
    }

    if (role === "doctor") {
      const doctor = await Doctors.findOne({ where: { doctorid: staffid } });
      if (doctor) {
        await doctor.update({ firstname, lastname, email, phonenumber });
        console.log("✅ Doctor table updated");
      } else {
        console.log("❕ No existing Doctor record found — skipping update");
      }
    }

    if (role === "nurse") {
      const nurse = await Nurses.findOne({ where: { nurseid: staffid } });
      if (nurse) {
        await nurse.update({ firstname, lastname, email, phonenumber });
        console.log("✅ Nurse table updated");
      } else {
        console.log("❕ No existing Nurse record found — skipping update");
      }
    }

    if (role === "receptionist") {
      const receptionist = await Receptionists.findOne({ where: { receptionistid: staffid } });
      if (receptionist) {
        await receptionist.update({ firstname, lastname, email, phonenumber });
        console.log("✅ Receptionist table updated");
      } else {
        console.log("❕ No existing Receptionist record found — skipping update");
      }
    }

    res.status(200).json({ message: "Employee updated successfully" });

  } catch (error) {
    console.error("❌ Error updating employee:", error);
    res.status(500).json({ message: "Server error" });
  }
};

  

const clinicLocations = async (req, res) => {
  try {
    const clinicLocations = await Shifts.findAll({
      attributes: ['cliniclocation'],
      include: [
        {
          model: Users, 
          as: 'staff', 
          attributes: [], 
          where: {
            role: ['doctor', 'specialist'], 
          },
        },
      ],
      group: ['cliniclocation'], //avoid dupes
    });
    res.status(200).json(clinicLocations);
  } catch (error) {
    console.error("Error fetching clinic locations:", error);
    res.status(500).json({ message: "Server error" });
  };
}

module.exports = { registerUser, loginUser, getSpeciality, clinicLocations, updateEmployeeUsers, gettingApplications, getEmployeeUsers, sendingApplications, creatingUser, updateApplicationStatus, getStaffUsers, getStaffShifts};
