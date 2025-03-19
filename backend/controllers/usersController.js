const bcrypt = require('bcrypt');
const { Users , Patients, Doctors} = require('../models'); // Adjust the path according to your project structure
const {sign} = require('jsonwebtoken');
const jwt = require('jsonwebtoken'); 


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
        console.log("User found in database:", user);
        const isMatch = await bcrypt.compare(password, user.passwordhash);

        if (!isMatch) {
            return res.status(400).json("Invalid credentials");
        }
        console.log("User ID:", user.id);
        const accessToken = sign(
            { 
            email: user.email, 
            role: user.role, 
            id: user.userid }, 
            process.env.jwtsecret, { //session token created stores role id and email
            expiresIn: '1h'
            }
        );
        
        //return user role to be used for redirection and for context
        const userRole = user.role;

        res.status(200).json({
            message: "Login successful" ,
            accessToken, 
            userRole: user.role,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json("Error logging in user");
    }
};

const getUserProfile = async (req, res) => {
    try {
        console.log("Incoming request to /users/me");
        
        //Extract token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.error("No Authorization header provided");
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1]; // Expecting "Bearer <token>"
        if (!token) {
            console.error("No token found in Authorization header");
            return res.status(401).json({ error: "Unauthorized: Token missing" });
        }

        //Verify JWT token using `jwt.verify()` instead of `sign`
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.jwtsecret);
        } catch (err) {
            console.error("JWT verification failed:", err.message);
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        console.log("Token verified:", decoded);

        //Find user in database
        const user = await Users.findByPk(decoded.id);
        if (!user) {
            console.error("User not found in database with ID:", decoded.id);
            return res.status(404).json({ error: "User not found" });
        }

        //Send user data
        console.log("User found:", user.email, "Role:", user.role);
        res.status(200).json({
            data: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Error fetching user profile" });
    }
};
module.exports = { registerUser, loginUser, getUserProfile };