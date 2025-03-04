const bcrypt = require('bcrypt');
const { Users } = require('../models'); // Adjust the path according to your project structure
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

        const userRole = user.role;

        res.status(200).json({message: "Login successful" ,accessToken, userRole});
    } catch (error) {
        console.error(error);
        res.status(500).json("Error logging in user");
    }
};

module.exports = { registerUser, loginUser };