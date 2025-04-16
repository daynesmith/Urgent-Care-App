const express = require('express')
const router = express.Router()

const{ getIfReceptionistInfo, inputReceptionistInfoForFirstTime, addNewShift, getAllShifts } = require('../controllers/receptionistController'); 
const {validateToken} = require('../middlewares/Authmiddleware');
router.post('/checkreceptionisttable', validateToken('receptionist'), getIfReceptionistInfo);
router.post('/inputreceptionistinfo', validateToken('receptionist'), inputReceptionistInfoForFirstTime);
router.post('/addNewShift', addNewShift);
router.get('/getAllShifts', getAllShifts); 

module.exports = router;