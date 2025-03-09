const { Users } = require('../models');

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
        return res.status(500).json("error occured while updating the users role")
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
        return res.status(500).json("error occured while updating the users role")
    }
}

module.exports = {toDoctor, toReceptionist, toAdmin};