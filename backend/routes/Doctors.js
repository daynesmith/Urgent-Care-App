const express = require('express')
const router = express.Router()

const{getIfDoctorInfo, inputInfoForFirstTime,syncDoctors, editDoctorInfo, getDoctorsNames, getAppointmentByDateRange, syncSpecialists} = require('../controllers/doctorController')
const {validateToken} = require('../middlewares/Authmiddleware');

router.post('/checkdoctortable', validateToken('doctor'), getIfDoctorInfo)
router.post('/inputdoctorinfo', validateToken('doctor'), inputInfoForFirstTime)
router.patch('/doctorinfo', validateToken('doctor'), editDoctorInfo);
router.post('/syncSpecialists', syncSpecialists);
router.post('/syncDoctors', syncDoctors);

router.get('/doctorsNames', getDoctorsNames);
router.get('/doctorappointmentsdaterange', validateToken('doctor'),getAppointmentByDateRange);



module.exports = router;