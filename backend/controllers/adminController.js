const { Users, Specialists, Doctors, Receptionists } = require('../models');

const toDoctor = async (req, res) =>{
    const { email } = req.body

    try{
        const user = await Users.findOne({where:{email}})

        if(!user){
            return res.status(404).json("user not found")
        }
        const existingDoc = await Doctors.findOne({where: {doctorid: user.userid}});

        if(!existingDoc) {
            await Doctors.create({
                doctorid: user.userid,
                firstname: '',
                lastname: '',
                dateofbirth: new Date(),
                phonenumber: '',
                doctortype: 'PK',
                email: user.email,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        user.role = 'doctor';
        
        await user.save();

        return res.status(200).json("user role updated to doctor")

    } catch(error){

        console.error(error)
        return res.status(500).json("error occured while updating the users role")
    }
}

const toReceptionist = async (req, res) =>{
    const { email } = req.body

    try{
        const user = await Users.findOne({where:{email}})

        if(!user){
            return res.status(404).json("user not found")
        }
        const existingRecep = await Doctors.findOne({where: {doctorid: user.userid}});

        user.role = 'receptionist';
        
        await user.save();

        return res.status(200).json("user role updated to receptionist")

    } catch(error){

        console.error(error)
        return res.status(500).json("error occured while updating the user's role")
    }
}

const toAdmin = async (req, res) =>{
    const { email } = req.body

    try{
        const user = await Users.findOne({where:{email}})

        if(!user){
            return res.status(404).json("user not found")
        }

        user.role = 'admin';
        
        await user.save();

        return res.status(200).json("user role updated to admin")

    } catch(error){

        console.error(error)
        return res.status(500).json("error occured while updating the user's role")
    }
}
const toSpecialist = async (req, res) =>{
    const { email } = req.body
    try{
        const user = await Users.findOne({where:{email}})

        if(!user){
            return res.status(404).json("user not found")
        }
        const existingSpecialist = await Specialists.findOne({where: {user_id: user.userid}});

        if(!existingSpecialist) {
            await Specialists.create({
                user_id: user.userid,
                specialty: '',
                department: '',
                accepting_referrals: 0,
                bio: '',
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        
        user.role = 'specialist';
        
        await user.save();

        return res.status(200).json("user role updated to specialist")

    } catch(error){

        console.error(error)
        return res.status(500).json("error occured while updating the user's role")
    }
}

const findEmployees = async (req, res) => {
    try {
        console.log("inside of findEmployees");
        const employees = await Users.findAll({
            where: {
              role: ['doctor', 'specialist', 'receptionist'],
            },
            include: [
              {
                model: Doctors,
                as: 'doctorProfile',
                attributes: ['firstname', 'lastname'],
                required: false,
              },
              {
                model: Specialists,
                as: 'specialistProfile',
                attributes: ['firstname', 'lastname'],
                required: false,
              },
              {
                model: Receptionists,
                as: 'receptionistProfile',
                attributes: ['firstname', 'lastname'],
                required: false,
              }
            ]
        });
        const formatted = employees.map((user) => {
            let name = '';
            if (user.role === 'doctor' && user.doctorProfile) {
            name = `${user.doctorProfile.firstname} ${user.doctorProfile.lastname}`;
            } else if (user.role === 'specialist' && user.specialistProfile) {
            name = `${user.specialistProfile.firstname} ${user.specialistProfile.lastname}`;
            } else if (user.role === 'receptionist' && user.receptionistProfile) {
            name = `${user.receptionistProfile.firstname} ${user.receptionistProfile.lastname}`;
            }
  
        return {
          userid: user.userid,
          role: user.role,
          name,
        };
        });

        res.status(200).json(formatted);
    } catch (err) {
  console.error('Error fetching employees:', err);
  res.status(500).json({ error: 'Could not retrieve employee list' });
}
};

module.exports = {toDoctor, toReceptionist, toAdmin, toSpecialist, findEmployees};