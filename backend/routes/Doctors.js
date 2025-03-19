const express = require('express')
const router = express.Router()

const{getIfDoctorInfo} = require('../controllers/doctorController')
const {validateToken} = require('../middlewares/Authmiddleware');

router.post('/checkdoctortable', validateToken('doctor'), getIfDoctorInfo)

module.exports = router;