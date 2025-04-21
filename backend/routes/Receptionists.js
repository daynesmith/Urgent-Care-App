const express = require('express')
const router = express.Router()

const{ getIfReceptionistInfo, inputReceptionistInfoForFirstTime ,getPatientsNames,  addNewShift, getAllShifts, syncReceptionists, updateProfile, getRevenueReport} = require('../controllers/receptionistController'); // Import the controller

const {validateToken} = require('../middlewares/Authmiddleware');

router.get('/checkreceptionisttable', validateToken('receptionist'), getIfReceptionistInfo);
router.post('/inputreceptionistinfo', validateToken('receptionist'), inputReceptionistInfoForFirstTime);
router.post('/syncreceptionists', syncReceptionists); 
router.post('/updateprofile',validateToken('receptionist'), updateProfile);
router.get('/patientsNames', getPatientsNames); 
router.post('/addNewShift', addNewShift);
router.get('/getAllShifts', getAllShifts); 
router.get('/revenue-report',validateToken('receptionist'), getRevenueReport);

module.exports = router;