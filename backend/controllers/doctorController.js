const {Doctors,Users} = require('../models');

const getIfDoctorInfo = async (req,res) =>{
    const email = req.user.email

    try{
        const docExists = await Doctors.findOne({where:{email: email}})

        if(!docExists){
            return res.status(200).json({formFilled: false})
        }

        return res.status(200).json({formFilled: true})
    }catch(error){
        console.error(error)
        res.status(500).json("error finding doctor info")
    }
}

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

module.exports = {inputInfoForFirstTime, getIfDoctorInfo, getDoctorsNames};