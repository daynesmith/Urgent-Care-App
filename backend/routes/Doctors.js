const express = require('express')
const router = express.Router()

const{getIfDoctorInfo, inputInfoForFirstTime, getDoctorsNames, getAppointmentByDateRange} = require('../controllers/doctorController')
const {validateToken} = require('../middlewares/Authmiddleware');

router.post('/checkdoctortable', validateToken('doctor'), getIfDoctorInfo)
router.post('/inputdoctorinfo', validateToken('doctor'), inputInfoForFirstTime)

router.get('/doctorsNames', getDoctorsNames);
router.get('/doctorappointmentsdaterange', validateToken('doctor'),getAppointmentByDateRange);

module.exports = router;