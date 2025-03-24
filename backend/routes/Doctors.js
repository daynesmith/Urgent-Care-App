const express = require('express')
const router = express.Router()

const{getIfDoctorInfo, inputInfoForFirstTime, getDoctorsNames} = require('../controllers/doctorController')
const {validateToken} = require('../middlewares/Authmiddleware');

router.post('/checkdoctortable', validateToken('doctor'), getIfDoctorInfo)
router.post('/inputdoctorinfo', validateToken('doctor'), inputInfoForFirstTime)

router.get('/doctorsNames', getDoctorsNames);

module.exports = router;