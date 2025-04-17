const bcrypt = require('bcrypt');
const { Users , Patients, Doctors, Applications, Shifts} = require('../models'); // Adjust the path according to your project structure
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

const creatingUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json("Email already registered");
    }

    // Hash the password
    const hash = await bcrypt.hash(password, 10);

    // Create user in DB
    const newUser = await Users.create({
      email: email,
      passwordhash: hash,
      role: role
    });

    res.status(201).json({ message: "User created successfully", userId: newUser.userid });
  } catch (error) {
    console.error("Error registering user:", error);
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
                role: ['doctor', 'receptionist', 'specialist']
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

const getStaffShifts = async (req, res) => {
    try {
        const staffid = req.user.id;

        if (!staffid) {
            return res.status(400).json({ message: "User ID is missing in the token." });
        }

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


module.exports = { registerUser, loginUser, gettingApplications, sendingApplications, creatingUser, updateApplicationStatus, getStaffUsers, getStaffShifts};
