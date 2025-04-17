const { Receptionists, Patients, Nurses, Doctors, Inventory} = require('../models'); 



const getAllInventory = async (req, res) => {
    try {
      const inventory = await Inventory.findAll();
  
      res.status(200).json(inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Server error" });
    }
};



const getAllMaterials = async (req, res) => {
    try {
      const materials = await Inventory.findAll({
        where: { itemType: 'Material' }, // filter only materials
        attributes: ['inventoryid', 'itemname', 'materialStock', 'materialStockMin', 'quantity', 'cost', 'date']
      });
  
      res.status(200).json(materials);
    } catch (error) {
      console.error("Error fetching materials:", error);
      res.status(500).json({ message: "Server error" });
    }
};

const getAllDoctorsTypes = async (req, res) => {
    try {
      const doctorTypes = await Inventory.findAll({
        where: { itemType: 'TypeOfDoctor' },
        attributes: ['inventoryid', 'itemname', 'cost'],
        include: [
          {
            model: Doctors,
            as: 'doctor',
            attributes: ['doctortype']
          }
        ]
      });
  
      res.status(200).json(doctorTypes);
    } catch (error) {
      console.error("Error fetching doctor types:", error);
      res.status(500).json({ message: "Server error" });
    }
};

const editDoctorTypeCost = async (req, res) => {
    const { inventoryid, itemname, cost } = req.body; // Extract inventoryid, itemname, and cost from the body
    
    try {
      const updated = await Inventory.update(
        { itemname, cost }, // Update both the name and cost
        { where: { inventoryid, itemType: 'TypeOfDoctor' } }
      );
  
      if (updated[0] === 0) {
        return res.status(404).json({ message: "Appointment type not found" });
      }
  
      res.status(200).json({ message: 'Appointment type updated successfully' });
    } catch (error) {
      console.error("Error updating appointment type:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

const getAllAppointmentTypes = async (req, res) => {
    try {
      const appointmentTypes = await Inventory.findAll({
        where: { itemtype: 'TypeOfAppointment' },
        attributes: ['inventoryid', 'itemname', 'cost']
      });
  
      res.status(200).json(appointmentTypes);
    } catch (error) {
      console.error("Error fetching appointment types:", error);
      res.status(500).json({ message: "Server error" });
    }
};

const addDoctor = async (req, res) => {
    const { itemname, cost } = req.body;
  
    // Log the incoming data to check if itemname and cost are being sent correctly
    console.log("Received data:", { itemname, cost });
  
    // Validate the inputs to ensure they are provided
    if (!itemname || !cost) {
      console.log("Validation failed: Missing itemname or cost");
      return res.status(400).json({ message: 'Item name and cost are required.' });
    }
  
    try {
      const newDoctor = await Inventory.create({
        itemtype: 'TypeOfDoctor',
        itemname,
        cost
      });
  
      // Log the successful creation of the new appointment type
      console.log("New appointment type created:", newDoctor);
  
      res.status(201).json(newDoctor);
    } catch (error) {
      // Log the error if there is a problem with the creation
      console.error("Error adding appointment type:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

const addAppointmentType = async (req, res) => {
    const { itemname, cost } = req.body;
  
    // Log the incoming data to check if itemname and cost are being sent correctly
    console.log("Received data:", { itemname, cost });
  
    // Validate the inputs to ensure they are provided
    if (!itemname || !cost) {
      console.log("Validation failed: Missing itemname or cost");
      return res.status(400).json({ message: 'Item name and cost are required.' });
    }
  
    try {
      const newAppointment = await Inventory.create({
        itemtype: 'TypeOfAppointment',
        itemname,
        cost
      });
  
      // Log the successful creation of the new appointment type
      console.log("New appointment type created:", newAppointment);
  
      res.status(201).json(newAppointment);
    } catch (error) {
      // Log the error if there is a problem with the creation
      console.error("Error adding appointment type:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

  const editAppointmentType = async (req, res) => {
    const { inventoryid, itemname, cost } = req.body; // Extract inventoryid, itemname, and cost from the body
    
    try {
      const updated = await Inventory.update(
        { itemname, cost }, // Update both the name and cost
        { where: { inventoryid, itemType: 'TypeOfAppointment' } }
      );
  
      if (updated[0] === 0) {
        return res.status(404).json({ message: "Appointment type not found" });
      }
  
      res.status(200).json({ message: 'Appointment type updated successfully' });
    } catch (error) {
      console.error("Error updating appointment type:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  

  const addMaterial = async (req, res) => {
    const { inventoryid, itemname, cost, materialStockMin, quantity, date } = req.body;
    console.log("Received Payload:", req.body);
  
    try {
      if (inventoryid) {
        // Updating an existing material
        const existing = await Inventory.findOne({ where: { inventoryid } });
        console.log('We have it:',existing);
        if (!existing) return res.status(404).json({ message: 'Material not found' });
  
        existing.quantity += quantity;  // Update quantity
        existing.date = date;  // Use provided date or default to current date
        await existing.save();
        console.log("Updating material:", existing); 
  
        return res.status(200).json(existing);
      } else {
        // Adding a new material
        const newMaterial = await Inventory.create({
          itemtype: 'Material',  // Default to 'Material' if adding a new one
          itemname,
          cost,
          materialStockMin,
          quantity,
          date: date || new Date(),  // Use provided date or default to current date
        });
        console.log("New Material Created:", newMaterial);
        return res.status(201).json(newMaterial);
      }
    } catch (error) {
      console.error("Error adding material:", error);
      res.status(500).json({ message: error.message, stack: error.stack });
    }
  };
  

  

  const editMaterialCost = async (req, res) => {
    const { inventoryid, cost } = req.body;
    console.log("Edit material request body:", req.body);
  
    if (!inventoryid || cost === undefined) {
      return res.status(400).json({ message: "Missing inventoryid or cost" });
    }
  
    try {
      const [updatedRows] = await Inventory.update(
        { cost: Number(cost) },
        {
          where: {
            inventoryid,
            itemType: 'Material'
          }
        }
      );
  
      if (updatedRows === 0) {
        return res.status(404).json({ message: "Material not found or no change" });
      }
  
      res.status(200).json({ message: "Material cost updated" });
    } catch (error) {
      console.error("Error updating material cost:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

module.exports = {getAllInventory, 
    getAllMaterials, 
    getAllDoctorsTypes, 
    getAllAppointmentTypes, 
    addAppointmentType, 
    addDoctor,
    addMaterial, 
    editMaterialCost,
    editDoctorTypeCost,
    editAppointmentType
}; 