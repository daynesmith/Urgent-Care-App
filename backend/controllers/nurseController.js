const {Users, Nurses, Patients, Appointments, Inventory, Doctors, Visitinfo, VisitinfoSupplies} = require('../models'); // Make sure both are imported!
const { Op } = require('sequelize'); // Import Op from Sequelize
const syncNurses = async (req, res) => {
  try {
    const nurseUsers = await Users.findAll({
      where: { role: 'nurse', status: 'accepted' }
    });

    if (!Nurses) {
      throw new Error('Nurses model is not defined. Please check your model imports.');
    }

    for (const user of nurseUsers) {
      const {
        firstname = null,
        lastname = null,
        dateofbirth = null,
        phonenumber = null,
        email,
        userid
      } = user;

      console.log('User data:', { userid, firstname, lastname, dateofbirth, phonenumber, email });

      if (!firstname || !lastname || !dateofbirth || !phonenumber || !email) {
        console.log(`Skipping user due to missing fields: ${email}`);
        continue;
      }

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
    return res.status(200).json({ message: 'Nurse sync complete.' });
  } catch (error) {
    console.error('Error syncing nurse:', error.message);
    return res.status(500).json({
      message: 'Error syncing nurse',
      error: error.message
    });
  }
};

// Function to create a new patient record by nurse
const createPatientByNurse = async (req, res) => {
    try {
        // Destructure the incoming request body to extract the data
        const {
            patientid, chief_complaint, symptoms, diagnosis, treatment_plan,
            additional_notes, follow_up, temperature, blood_pressure, heart_rate, respiratory_rate,
            oxygen_saturation, weight, height
        } = req.body;

        console.log("Nurse info:",req.body )

        // Create a new patient record
        const newPatient = await Patients.create({
            patientid, 
            chronic_conditions, 
            past_surgeries, 
            current_medications, 
            allergies, 
            lifestyle_factors,
            vaccination_status, 
            chief_complaint, 
            symptoms, 
            diagnosis, 
            treatment_plan,
            additional_notes, 
            follow_up, 
            temperature, 
            blood_pressure, 
            heart_rate, 
            respiratory_rate,
            oxygen_saturation, 
            weight, 
            height
        });

        // Respond with the newly created patient record
        return res.status(201).json({
            message: 'Patient created successfully by nurse',
            patient: newPatient
        });

    } catch (error) {
        console.error('Error creating patient:', error);
        return res.status(500).json({
            message: 'Failed to create patient',
            error: error.message
        });
    }
};


const getSingleAppointment = async (req, res) => {
  try {
    const { id } = req.query; // 💥 this is important!
  console.log("We have the id:", id)
    if (!id) {
      return res.status(400).json({ message: "Missing appointment ID" });
    }
    console.log("Appointment model:", Appointments);

    const appointment = await Appointments.findOne({
      where: { appointmentid: id },
      include: [
                  {
                    model: Patients,
                    as: 'patient',
                    attributes: ['firstname', 'lastname', 'phonenumber', 'email']
                  },
                  {
                    model: Doctors,
                    as: 'doctor',
                    attributes: ['firstname', 'lastname']
                  }
                ]
    });

    

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// Route to get all supplies from inventory
const getAllSupplies = async (req, res) => {
  try {
    // Fetch supplies where itemtype is "Materials" and quantity is greater than 0
    const inventory = await Inventory.findAll({
      where: { itemtype: "Material", quantity: { [Op.gt]: 0 } }, // Using Sequelize's Op.gt (greater than)
    });

    res.status(200).json(inventory); // Return the list of materials
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ message: "Server error" }); // Handle errors
  }
};
const createVisitInfo = async (req, res) => {
  try {
    const {
      visitid, temperature, blood_pressure, heart_rate, respiratory_rate,
      oxygen_saturation, weight, height
    } = req.body;

    console.log("Nurse info:", req.body);

    // Check if a Visitinfo with this ID already exists
    const existingVisit = await Visitinfo.findOne({ where: { visitinfoid: visitid} });
    console.log("Checking", existingVisit)
    if (existingVisit) {
      return res.status(200).json({
        message: 'Visit info already exists. Skipping creation.',
        data: existingVisit
      });
    }

    // If not found, create a new one
    const newVisitInfo = await Visitinfo.create({
      visitinfoid: visitid,
      temperature, 
      blood_pressure, 
      heart_rate, 
      respiratory_rate,
      oxygen_saturation, 
      weight, 
      height
    });

    console.log("NewVisitform:", newVisitInfo)
    return res.status(201).json({
      message: 'Visit info created successfully',
      data: newVisitInfo
    });

  } catch (error) {
    console.error('Error creating visit info:', error);
    return res.status(500).json({
      message: 'Failed to create visit info',
      error: error.message
    });
  }
};


const createUsedSupplies = async (req, res) => {
  try {
    const { visitinfoid, supplies } = req.body;
    // supplies = [{ name: 'Bandage', quantity: 2, notes: 'Used on arm wound' }, ...]

    if (!visitinfoid || !Array.isArray(supplies) || supplies.length === 0) {
      return res.status(400).json({ message: 'Invalid input. Visit ID and supply list required.' });
    }

    const createdSupplies = [];

    for (const item of supplies) {
      const { name, quantity, notes } = item;
      console.log("The items used: ", item);

      // Optional: Update inventory stock if you have a matching system
      const inventoryItem = await Inventory.findOne({ where: { itemname: name } });
      if (inventoryItem) {
        if (inventoryItem.stock < quantity) {
          return res.status(400).json({ message: `Not enough stock for ${itemname}` });
        }
        inventoryItem.quantity -= quantity;
        await inventoryItem.save();
      }

      // Create visit info supply log
      const supplyRecord = await VisitinfoSupplies.create({
        visitinfoid,
        name,
        quantity,
        notes
      });

      createdSupplies.push(supplyRecord);
    }

    return res.status(201).json({
      message: 'Supplies logged and inventory updated successfully',
      data: createdSupplies
    });

  } catch (error) {
    console.error('Error logging supplies:', error);
    return res.status(500).json({
      message: 'Failed to log visit supplies',
      error: error.message
    });
  }
};



module.exports = {syncNurses,  createPatientByNurse, getSingleAppointment, getAllSupplies, createVisitInfo, createUsedSupplies}; 