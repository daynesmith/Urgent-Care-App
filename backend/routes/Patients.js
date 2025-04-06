const express = require('express')
const router = express.Router()

const{getIfPatientInfo, inputPatientInfoForFirstTime, getPatientsNames, getMedicalHistory, editMedicalHistory } = require('../controllers/patientController')
const {validateToken} = require('../middlewares/Authmiddleware');

router.post('/checkpatienttable', validateToken('patient'), getIfPatientInfo)
router.post('/inputpatientinfo', validateToken('patient'), inputPatientInfoForFirstTime)

router.get('/patientsNames', getPatientsNames);
router.get('/medical-history', validateToken('patient'), getMedicalHistory);
router.patch('/medical-history', validateToken('patient'), editMedicalHistory);

module.exports = router;