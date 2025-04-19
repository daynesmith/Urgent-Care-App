const express = require('express')
const router = express.Router()

const{getIfPatientInfo, inputPatientInfoForFirstTime, getPatientsNames, getMedicalHistory, editMedicalHistory, getPatientsByDoctor, getPatientInfo, editPatientInfo, getPatientBilling, getSinglePatientBill, updateBillStatus } = require('../controllers/patientController')
const {validateToken} = require('../middlewares/Authmiddleware');

router.post('/checkpatienttable', validateToken('patient'), getIfPatientInfo)
router.post('/inputpatientinfo', validateToken('patient'), inputPatientInfoForFirstTime)
router.get('/patientinfo', validateToken('patient'), getPatientInfo);
router.patch('/patientinfo', validateToken('patient'), editPatientInfo);


router.get('/patientsNames', validateToken('receptionist'),getPatientsNames);
router.get('/medical-history', validateToken('patient'), getMedicalHistory);
router.get('/patient-billing', validateToken('patient'), getPatientBilling);
router.get('/patient-billing/:billingid', validateToken('patient'), getSinglePatientBill);
router.patch('/update-bill-status/:billingid', validateToken('patient'), updateBillStatus);
router.get('/by-doctor', getPatientsByDoctor);
router.patch('/medical-history', validateToken('patient'), editMedicalHistory);


module.exports = router;