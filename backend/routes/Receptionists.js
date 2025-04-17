const express = require('express')
const router = express.Router()

const{ getIfReceptionistInfo, inputReceptionistInfoForFirstTime , syncReceptionists, updateProfile} = require('../controllers/receptionistController'); // Import the controller
const {validateToken} = require('../middlewares/Authmiddleware');

router.get('/checkreceptionisttable', validateToken('receptionist'), getIfReceptionistInfo);
router.post('/inputreceptionistinfo', validateToken('receptionist'), inputReceptionistInfoForFirstTime);
router.post('/syncreceptionists', syncReceptionists); 
router.post('/updateprofile',validateToken('receptionist'), updateProfile);


module.exports = router;