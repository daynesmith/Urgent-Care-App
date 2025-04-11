const bcrypt = require('bcrypt');
const { Users , Patients, Doctors, Applications} = require('../models'); // Adjust the path according to your project structure
const {sign} = require('jsonwebtoken')


const registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const hash = await bcrypt.hash(password, 10);
        await Users.create({
            email: email,
            passwordhash: hash
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
            userId: user.userid
        });
    } catch (error) {
        console.error(error);
        res.status(500).json("Error logging in user");
    }
};



const sendingApplications = async (req, res) => {

    try {
        const { firstname, lastname, dateofbirth, phonenumber, qualifications, certifications, stafftype, email, password, experience, coverletter, street, city, state, zip } = req.body;

        console.log('Received data for application creation:', {  firstname, lastname, dateofbirth, phonenumber, stafftype, email, password, experience, coverletter, street, city, state, zip });

        // Validate required fields
        if (!firstname || !lastname || !dateofbirth || !phonenumber || !stafftype || !email || !password || !experience || !experience || !coverletter || !street || !city || !state || !zip) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Create the application object with form data
        const applicationData = await Applications.create({
            firstname,
            lastname,
            dateofbirth,
            phonenumber,
            stafftype,
            email,
            password,
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
        res.status(201).json({ message: "Application was created successfully", applicationData });


    } catch (error) {
      // Log the full error to capture more details
      console.error('Error processing application:', error);
      // Send a more detailed error response
      return res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
};



const gettingApplications = async (req, res) => {
    console.log('Request received at backend over here.');
    try {
        const applications = await Applications.findAll({
            attributes: [
              'firstName',
              'lastName',
              'dateofbirth',
              'phonenumber',
              'stafftype',
              'email',
              'password',
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


module.exports = { registerUser, loginUser, gettingApplications, sendingApplications, creatingUser};