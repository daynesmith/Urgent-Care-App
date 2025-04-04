const { Receptionist } = require('../models'); // Import the Receptionist model

const registerReceptionist = async (req, res) => {
    const { firstName, lastName, phoneNumber } = req.body;

    try {
        // Check if a receptionist with this phone number already exists
        const existingReceptionist = await Receptionist.findOne({ where: { phoneNumber } });

        if (existingReceptionist) {
            // Update the existing receptionist's profile
            await Receptionist.update(
                { firstName, lastName },
                { where: { phoneNumber } }
            );
            res.status(200).json('Profile updated successfully');
        } else {
            // If no profile exists, create a new one
            await Receptionist.create({
                firstName,
                lastName,
                phoneNumber,
            });
            res.status(200).json('Profile saved successfully');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json('Error registering or updating receptionist profile');
    }
};

module.exports = { registerReceptionist };