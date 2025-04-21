const express = require('express')
const router = express.Router()

const{ getIfReceptionistInfo, createBilling,getBillingInfo, getBillingStatus, inputReceptionistInfoForFirstTime ,getPatientsNames,  addNewShift, getAllShifts, syncReceptionists, updateProfile} = require('../controllers/receptionistController'); // Import the controller

const {validateToken} = require('../middlewares/Authmiddleware');

router.get('/checkreceptionisttable', validateToken('receptionist'), getIfReceptionistInfo);
router.post('/inputreceptionistinfo', validateToken('receptionist'), inputReceptionistInfoForFirstTime);
router.post('/syncreceptionists', syncReceptionists); 
router.post('/updateprofile',validateToken('receptionist'), updateProfile);
router.get('/patientsNames', getPatientsNames); 
router.post('/addNewShift', addNewShift);
router.get('/getAllShifts', getAllShifts); 


// Create billing
router.post("/create", createBilling);

// Get all or one billing by appointment ID
router.get("/getbilling/:appointmentid", getBillingInfo);

// Update billing by billing ID
router.get("/getStatus", getBillingStatus);

module.exports = router;