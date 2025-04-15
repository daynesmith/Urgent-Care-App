const { Users, Specialists, Doctors, Receptionists} = require('../models');
const { Op } = require("sequelize");

const sendingApplications = async (req, res) => {

    try {
        const { firstname, lastname, dateofbirth, phonenumber, qualifications, certifications, stafftype, email, password, experience, coverletter, street, city, state, zip } = req.body;

        //console.log('Received data for application creation:', {  firstname, lastname, dateofbirth, phonenumber, stafftype, email, password, experience, coverletter, street, city, state, zip });

        // Validate required fields
        if (!firstname || !lastname || !dateofbirth || !phonenumber || !stafftype || !email || !password || !experience || !experience || !coverletter || !street || !city || !state || !zip) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Create the application object with form data
        const applicationData = await Users.create({
            firstname,
            lastname,
            dateofbirth,
            phonenumber,
            stafftype,
            email,
            passwordhash,
            experience,
            qualifications,
            certifications,
            coverletter,
            street,
            city,
            state,
            zip,
      });

       //console.log('Application is created:', applicationData); 
        res.status(201).json({ message: "Application was created successfully", applicationData });


    } catch (error) {
      // Log the full error to capture more details
      console.error('Error processing application:', error);
      // Send a more detailed error response
      return res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
};


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
console.log("QUERY:", req.query);

const findEmployees = async (req, res) => {
    try {
      const { role, startDate, endDate } = req.query;
      
      const rolesToFetch =
        role && ['doctor', 'specialist', 'receptionist'].includes(role)
          ? [role]
          : ['doctor', 'specialist', 'receptionist'];

      const include = [
        {
          model: Doctors,
          as: 'doctorProfile',
          attributes: ['firstname', 'lastname', 'createdAt', 'updatedAt'],
          required: false,
        },
        {
          model: Specialists,
          as: 'specialistProfile',
          attributes: ['firstname', 'lastname', 'createdAt', 'updatedAt'],
          required: false,
        },
        {
          model: Receptionists,
          as: 'receptionistProfile',
          attributes: ['firstname', 'lastname', 'createdAt', 'updatedAt'],
          required: false,
        }
      ];
      
      if ((startDate || endDate) && role) {
        const dateFilter = {};
        if (startDate) {
          dateFilter[Op.gte] = new Date(startDate);
        }
        if (endDate) {
          dateFilter[Op.lte] = new Date(endDate);
        }
        
        if (role === 'doctor') {
          include[0].where = { createdAt: dateFilter };
          include[0].required = true;
        } else if (role === 'specialist') {
          include[1].where = { createdAt: dateFilter };
          include[1].required = true;
        } else if (role === 'receptionist') {
          include[2].where = { createdAt: dateFilter };
          include[2].required = true;
        }
      }
      const employees = await Users.findAll({
        where: {
          role: rolesToFetch,
        },
        include,
      });
      //(JSON.stringify(employees, null, 2));
      
      const formatted = employees.map((user) => {
        let name = '';
        let createdAt = null;
        let updatedAt = null;
        if (user.role === 'doctor' && user.doctorProfile) {
          name = `${user.doctorProfile.firstname} ${user.doctorProfile.lastname}`;
          createdAt = user.doctorProfile.createdAt;
          updatedAt = user.doctorProfile.updatedAt;
        } 
        else if (user.role === 'specialist' && user.specialistProfile) {
          name = `${user.specialistProfile.firstname} ${user.specialistProfile.lastname}`;
          createdAt = user.specialistProfile.createdAt;
          updatedAt = user.specialistProfile.updatedAt;
        } 
        else if (user.role === 'receptionist' && user.receptionistProfile) {
          name = `${user.receptionistProfile.firstname} ${user.receptionistProfile.lastname}`;
          createdAt = user.receptionistProfile.createdAt;
          updatedAt = user.receptionistProfile.updatedAt;
        }
        //console.log(createdAt, " created" , updatedAt , "updated");
  
        return {
          userid: user.userid,
          role: user.role,
          name,
          createdAt,
          updatedAt,
        };
      });
  
      res.status(200).json(formatted);
    } catch (err) {
      console.error('Error fetching employees:', err);
      res.status(500).json({ error: 'Could not retrieve employee list' });
    }
  };
  
module.exports = {toDoctor, toReceptionist, toAdmin, toSpecialist, sendingApplications, findEmployees};