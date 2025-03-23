const express = require('express')
const router = express.Router()

const {validateToken} = require('../middlewares/Authmiddleware');
const { getPatientAppointments } = require('../controllers/AppointmentsController')


router.get('/patient-appointments', validateToken('patient'), getPatientAppointments);


module.exports = router;