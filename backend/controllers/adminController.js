const { Users, Doctors, Specialists} = require('../models');

const toDoctor = async (req, res) =>{
    const { email } = req.body

    try{
        const user = await Users.findOne({where:{email}})

        if(!user){
            return res.status(404).json("user not found")
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
    console.log("got into specialist");
    try{
        const user = await Users.findOne({where:{email}})

        if(!user){
            return res.status(404).json("user not found")
        }

        user.role = 'specialist';
        
        await user.save();

        return res.status(200).json("user role updated to specialist")

    } catch(error){

        console.error(error)
        return res.status(500).json("error occured while updating the user's role")
    }
}

const searchByRole = async(req, res) => {
    const {role} = req.query;

    const allowedRoles = ['doctor', 'specialist'];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({error:'Invalid role specified' })
    }
    try {
        if (role === 'doctor') {
            const doctors = await Doctors.findAll({
              attributes: ['firstname', 'lastname', 'doctortype'],
            });
            return res.status(200).json(doctors);
          }
      
          if (role === 'specialist') {
            const specialists = await Specialists.findAll({
              attributes: ['user_id', 'specialty', 'department', 'accepting_referrals'],
            });
            return res.status(200).json(specialists);
          }
          return res.status(400).json({ error: 'Invalid role specified' });

        } catch (error) {
          console.error('Error querying users by role:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }
}

module.exports = {toDoctor, toReceptionist, toAdmin, toSpecialist, searchByRole};