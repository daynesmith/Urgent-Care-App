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

const inputInfoForFirstTime = async (req, res) =>{
    const {firstname, lastname, dateofbirth, phonenumber, doctortype} = req.body;

    try{
        const user = await Users.findOne({where: {email}})

        if(!user){
            return res.status(404).json("email not found");
        }
        
        const doctorid = req.user.id
        const email = req.user.email

    }catch(error){
        console.error(error)
    }
}

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