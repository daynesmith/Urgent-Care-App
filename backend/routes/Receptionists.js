const express = require('express')
const router = express.Router()

const{ getIfReceptionistInfo, inputReceptionistInfoForFirstTime } = require('../controllers/receptionistController'); // Import the controller
const {validateToken} = require('../middlewares/Authmiddleware');
router.post('/checkreceptionisttable', validateToken('receptionist'), getIfReceptionistInfo);
router.post('/inputreceptionistinfo', validateToken('receptionist'), inputReceptionistInfoForFirstTime);


module.exports = router;