const { Receptionists, Users, Shifts} = require('../models'); // Import the Receptionist model

const getIfReceptionistInfo = async (req, res) => {
    const email = req.user.email

    try{
        const receptionistExists = await Receptionists.findOne({where:{email: email}})

        if(!receptionistExists){
            return res.status(200).json({formFilled: false})
        }

        return res.status(200).json({formFilled: true})
    }catch(error){
        console.error(error)
        res.status(500).json("error finding receptioist info")
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

const addNewShift = async (req, res) => {
    try {
        const shifts = Array.isArray(req.body) ? req.body : [req.body]; // Handle both single and multiple shifts

        const createdShifts = [];

        for (const shift of shifts) {
            const { staffid, startshift, endshift, date, notes, cliniclocation } = shift;

            console.log('Processing shift:', { staffid, startshift, endshift, date, notes, cliniclocation });

            // Validate required fields
            if (!staffid || !startshift || !endshift || !date || !cliniclocation) {
                return res.status(400).json({ message: "Missing required fields in one or more shifts." });
            }

            // Check for existing shift on the same date
            const existingShift = await Shifts.findOne({
                where: {
                    staffid,
                    date,
                },
            });

            if (existingShift) {
                return res.status(400).json({
                    message: `A shift already exists for staff member ${staffid} on ${date}.`,
                });
            }

            // Create the shift
            const newShift = await Shifts.create({
                staffid,
                startshift,
                endshift,
                date,
                notes,
                cliniclocation,
            });

            createdShifts.push(newShift);
        }

        console.log('Shifts created:', createdShifts);
        res.status(201).json({ message: "Shifts created successfully", shifts: createdShifts });
    } catch (error) {
        console.error("Error creating shifts:", error);
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

module.exports = { getIfReceptionistInfo, inputReceptionistInfoForFirstTime, addNewShift, getAllShifts };