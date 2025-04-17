const express = require('express')
const router = express.Router()

const{ getIfReceptionistInfo, inputReceptionistInfoForFirstTime , addNewShift, getAllShifts, syncReceptionists, updateProfile} = require('../controllers/receptionistController'); // Import the controller

const {validateToken} = require('../middlewares/Authmiddleware');

router.get('/checkreceptionisttable', validateToken('receptionist'), getIfReceptionistInfo);
router.post('/inputreceptionistinfo', validateToken('receptionist'), inputReceptionistInfoForFirstTime);
router.post('/syncreceptionists', syncReceptionists); 
router.post('/updateprofile',validateToken('receptionist'), updateProfile);
router.post('/addNewShift', addNewShift);
router.get('/getAllShifts', getAllShifts); 

module.exports = router;