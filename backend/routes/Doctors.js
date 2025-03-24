const express = require('express')
const router = express.Router()

const{getIfDoctorInfo, getDoctorsNames} = require('../controllers/doctorController')
const {validateToken} = require('../middlewares/Authmiddleware');

router.post('/checkdoctortable', validateToken('doctor'), getIfDoctorInfo)

router.get('/doctorsNames', getDoctorsNames);

module.exports = router;