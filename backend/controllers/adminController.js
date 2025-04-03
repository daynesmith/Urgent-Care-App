const { Users, Specialists, Doctors } = require('../models');

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
    console.log("got into specialist");
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

module.exports = {toDoctor, toReceptionist, toAdmin, toSpecialist};