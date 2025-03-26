const express = require('express')
const router = express.Router()

const{getIfPatientInfo, inputPatientInfoForFirstTime, getPatientsNames} = require('../controllers/patientController')
const {validateToken} = require('../middlewares/Authmiddleware');

router.post('/checkpatienttable', validateToken('patient'), getIfPatientInfo)
router.post('/inputpatientinfo', validateToken('patient'), inputPatientInfoForFirstTime)

router.get('/patientsNames', getPatientsNames);


module.exports = router;