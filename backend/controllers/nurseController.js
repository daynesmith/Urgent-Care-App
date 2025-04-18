const { Nurses, Users} = require('../models');



const syncNurses = async (req, res) => {
    try {
      const nurseUsers = await Users.findAll({
        where: { role: 'nurse', status: 'accepted' }
      });
  
      for (const user of nurseUsers) {
        const { firstname, lastname, dateofbirth, phonenumber, email, userid } = user;
  
        console.log('User data:', { userid, firstname, lastname, dateofbirth, phonenumber, email });
  
        if (!firstname || !lastname || !dateofbirth || !phonenumber) {
          console.log(`Skipping user due to missing fields: ${email}`);
          continue;
        }
  
        // ✅ Correct model name here
        const exists = await Nurses.findOne({ where: { email } });
  
        if (!exists) {
          await Nurses.create({
            nurseid: userid,
            firstname,
            lastname,
            dateofbirth,
            phonenumber,
            email
          });
          console.log(`Added nurse: ${firstname} ${lastname}`);
        } else {
          console.log(`Nurse ${email} already exists.`);
        }
      }
  
      console.log('Nurse sync complete.');
      res.status(200).json({ message: 'Nurse sync complete.' });
    } catch (error) {
      console.error('Error syncing nurse:', error);
      res.status(500).json({ message: 'Error syncing nurse', error: error.message });
    }
  };
  

    module.exports = {syncNurses}; 