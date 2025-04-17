const express = require('express')
const router = express.Router()

const {
    getAllMaterials,
    getAllDoctorsTypes,
    getAllAppointmentTypes,
    getAllInventory,
    addMaterial,
    addAppointmentType,
    editMaterialCost,
    addDoctor,
    editAppointmentType,
    editDoctorTypeCost
  } = require('../controllers/InventoryController');

router.get('/getInventory', getAllInventory);
router.get('/getMaterials', getAllMaterials);
router.get('/getdoctortypes', getAllDoctorsTypes);
router.get('/getappointmenttypes', getAllAppointmentTypes);


router.post('/addmaterials', addMaterial);
router.post('/addappointmenttypes', addAppointmentType);
router.post('/adddoctortypes', addDoctor);

router.post('/editMaterials', editMaterialCost);
router.post('/editappointmenttypes', editAppointmentType);
router.post('/editdoctortypes', editDoctorTypeCost);


module.exports = router;